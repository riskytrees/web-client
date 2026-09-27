import React from 'react';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Home from '@mui/icons-material/Home';
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from '@mui/material/Typography';
import { Grid, TextField } from '@mui/material';
import LogoMark from './img/logomark.svg';
import { FormatUtils } from './format';
import { LossExceedancePoint, RiskCalculator, RiskCalculatorInputs } from './RiskCalculator';

const CHART_WIDTH = 600;
const CHART_HEIGHT = 300;
const CHART_PADDING = 50;

export const CALCULATOR_FIELDS = [
  "confidenceInterval",
  "impactMin",
  "impactMax",
  "likelihoodMin",
  "likelihoodExpected",
  "likelihoodMax"
] as const;

export type CalculatorField = typeof CALCULATOR_FIELDS[number];

// Only plain decimal numbers are accepted, so nothing that could be used for
// injection ever makes it out of a query parameter and into the page.
const NUMERIC_PATTERN = /^-?(\d+(\.\d+)?|\.\d+)([eE][-+]?\d+)?$/;

/**
 * Returns the value only when it is a numeric string, otherwise null.
 */
export function sanitizeNumericValue(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const trimmed = value.trim();

  if (!NUMERIC_PATTERN.test(trimmed) || !isFinite(parseFloat(trimmed))) {
    return null;
  }

  return trimmed;
}

/**
 * Reads the calculator fields from the current URL, dropping anything that is
 * not a numeric value.
 */
export function readCalculatorQueryParams(search: string): Partial<Record<CalculatorField, string>> {
  const params = new URLSearchParams(search);
  const values: Partial<Record<CalculatorField, string>> = {};

  for (const field of CALCULATOR_FIELDS) {
    const sanitized = sanitizeNumericValue(params.get(field));

    if (sanitized !== null) {
      values[field] = sanitized;
    }
  }

  return values;
}

function LossExceedanceCurve(props: { curve: LossExceedancePoint[] }) {
  if (props.curve.length === 0) {
    return null;
  }

  const maxLoss = props.curve[props.curve.length - 1].loss;
  const minLoss = props.curve[0].loss;
  const lossRange = maxLoss - minLoss;

  const xForLoss = (loss: number) => {
    const ratio = lossRange > 0 ? (loss - minLoss) / lossRange : 0;
    return CHART_PADDING + (ratio * (CHART_WIDTH - (2 * CHART_PADDING)));
  };

  const yForProbability = (probability: number) => {
    return CHART_HEIGHT - CHART_PADDING - (probability * (CHART_HEIGHT - (2 * CHART_PADDING)));
  };

  const linePoints = props.curve.map(point => `${xForLoss(point.loss)},${yForProbability(point.probability)}`).join(' ');

  const lossTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => minLoss + (ratio * lossRange));
  const probabilityTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg role="img" aria-label="Loss exceedance curve" width={CHART_WIDTH} height={CHART_HEIGHT}>
      <line x1={CHART_PADDING} y1={CHART_PADDING} x2={CHART_PADDING} y2={CHART_HEIGHT - CHART_PADDING} stroke="#888888" />
      <line x1={CHART_PADDING} y1={CHART_HEIGHT - CHART_PADDING} x2={CHART_WIDTH - CHART_PADDING} y2={CHART_HEIGHT - CHART_PADDING} stroke="#888888" />

      {probabilityTicks.map(probability => (
        <text key={`probability-${probability}`} x={CHART_PADDING - 8} y={yForProbability(probability) + 4} textAnchor="end" fontSize="10" fill="#888888">
          {Math.round(probability * 100)}%
        </text>
      ))}

      {lossTicks.map((loss, index) => (
        <text key={`loss-${index}`} x={xForLoss(loss)} y={CHART_HEIGHT - CHART_PADDING + 16} textAnchor="middle" fontSize="10" fill="#888888">
          ${FormatUtils.numberWithCommas(Math.round(loss))}
        </text>
      ))}

      <polyline points={linePoints} fill="none" stroke="#d32f2f" strokeWidth="2" />
    </svg>
  );
}

class CalculatorPage extends React.Component<{
}, {
  confidenceInterval: string;
  impactMin: string;
  impactMax: string;
  likelihoodMin: string;
  likelihoodExpected: string;
  likelihoodMax: string;
  expectedLoss: number | null;
  lossExceedanceCurve: LossExceedancePoint[];
  errors: string[];
}> {

  constructor(props) {
    super(props);

    const queryValues = readCalculatorQueryParams(window.location.search);

    this.state = {
      confidenceInterval: queryValues.confidenceInterval ?? "90",
      impactMin: queryValues.impactMin ?? "",
      impactMax: queryValues.impactMax ?? "",
      likelihoodMin: queryValues.likelihoodMin ?? "",
      likelihoodExpected: queryValues.likelihoodExpected ?? "",
      likelihoodMax: queryValues.likelihoodMax ?? "",
      expectedLoss: null,
      lossExceedanceCurve: [],
      errors: []
    };

    this.calculate = this.calculate.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentDidMount() {
    // A shared link carries every input, so the findings can be reproduced
    // without having to press Calculate again.
    const hasEveryInput = CALCULATOR_FIELDS.every(field => sanitizeNumericValue(this.state[field]) !== null);

    if (hasEveryInput && RiskCalculator.validateInputs(this.getInputs()).length === 0) {
      this.calculate();
    }
  }

  handleFieldChange(field: CalculatorField, value: string) {
    this.setState({ [field]: value } as Pick<CalculatorPage['state'], CalculatorField>, () => {
      this.updateQueryParams();
    });
  }

  /**
   * Mirrors the current inputs into the URL so the page can be shared. Values
   * that are not numeric are removed rather than written out.
   */
  updateQueryParams() {
    const params = new URLSearchParams(window.location.search);

    for (const field of CALCULATOR_FIELDS) {
      const sanitized = sanitizeNumericValue(this.state[field]);

      if (sanitized === null) {
        params.delete(field);
      } else {
        params.set(field, sanitized);
      }
    }

    const query = params.toString();

    window.history.replaceState(null, '', query ? `${window.location.pathname}?${query}` : window.location.pathname);
  }

  getInputs(): RiskCalculatorInputs {
    // Anything that is not a plain number becomes NaN so it is rejected by
    // validateInputs rather than being loosely parsed.
    const numericValue = (value: string) => {
      const sanitized = sanitizeNumericValue(value);

      return sanitized === null ? NaN : parseFloat(sanitized);
    };

    return {
      confidenceInterval: numericValue(this.state.confidenceInterval),
      impactMin: numericValue(this.state.impactMin),
      impactMax: numericValue(this.state.impactMax),
      likelihoodMin: numericValue(this.state.likelihoodMin),
      likelihoodExpected: numericValue(this.state.likelihoodExpected),
      likelihoodMax: numericValue(this.state.likelihoodMax)
    };
  }

  calculate() {
    const inputs = this.getInputs();
    const errors = RiskCalculator.validateInputs(inputs);

    if (errors.length > 0) {
      this.setState({
        errors,
        expectedLoss: null,
        lossExceedanceCurve: []
      });
      return;
    }

    const result = RiskCalculator.runSimulation(inputs);

    this.setState({
      errors: [],
      expectedLoss: result.expectedLoss,
      lossExceedanceCurve: result.lossExceedanceCurve
    });
  }

  render() {

    return (
      <>
        <AppBar>
          <Grid container>
            <Grid size={4} marginTop="5.75px">
              <Stack spacing={2} direction="row">
                <Box></Box>
                <Button aria-describedby="actionButton" variant='inlineNavButton'><img src={LogoMark} alt="Risky Trees" width="25px"></img></Button>

              </Stack>
            </Grid>

            <Grid size={4} marginTop="5.75px">
              <Stack alignContent="center">
                <Box display="flex" justifyContent="center" alignItems="center" >
                  <Button variant='inlineNavButton' endIcon={<Home />} onClick={() => {
                    window.location.href = "/";
                  }}>Home</Button>
                </Box>

              </Stack>
            </Grid>
          </Grid>
        </AppBar>

        <Stack direction="row">
          <Paper sx={{ marginLeft: 3, marginTop: 10, padding: 2 }}>
            <Typography variant='h1'>Risk Calculator</Typography>
            <Typography variant='body3'>Estimate the loss a risk could cause by simulating {RiskCalculator.DEFAULT_ITERATIONS.toLocaleString()} possible outcomes.</Typography>

            <Box height={"20px"}></Box>
            <Stack direction="column" spacing={2} maxWidth="400px">
              <TextField
                id="confidenceInterval"
                label="Confidence Interval (%)"
                type="number"
                size="small"
                value={this.state.confidenceInterval}
                onChange={(event) => this.handleFieldChange("confidenceInterval", event.target.value)}
              />
              <TextField
                id="impactMin"
                label="Impact Lower Bound"
                type="number"
                size="small"
                value={this.state.impactMin}
                onChange={(event) => this.handleFieldChange("impactMin", event.target.value)}
              />
              <TextField
                id="impactMax"
                label="Impact Upper Bound"
                type="number"
                size="small"
                value={this.state.impactMax}
                onChange={(event) => this.handleFieldChange("impactMax", event.target.value)}
              />
              <TextField
                id="likelihoodMin"
                label="Likelihood Min"
                type="number"
                size="small"
                value={this.state.likelihoodMin}
                onChange={(event) => this.handleFieldChange("likelihoodMin", event.target.value)}
              />
              <TextField
                id="likelihoodExpected"
                label="Likelihood Expected"
                type="number"
                size="small"
                value={this.state.likelihoodExpected}
                onChange={(event) => this.handleFieldChange("likelihoodExpected", event.target.value)}
              />
              <TextField
                id="likelihoodMax"
                label="Likelihood Max"
                type="number"
                size="small"
                value={this.state.likelihoodMax}
                onChange={(event) => this.handleFieldChange("likelihoodMax", event.target.value)}
              />
              <Button id="calculateButton" variant="primaryButton" onClick={this.calculate}>Calculate</Button>
            </Stack>

            {this.state.errors.length > 0 && (
              <Box marginTop={"20px"}>
                {this.state.errors.map(error => (
                  <Typography key={error} color="error">{error}</Typography>
                ))}
              </Box>
            )}

            {this.state.expectedLoss !== null && (
              <Box marginTop={"20px"}>
                <Typography variant='h2'>Expected Loss</Typography>
                <Typography variant='h1' id="expectedLoss">${FormatUtils.numberWithCommas(Math.round(this.state.expectedLoss))}</Typography>

                <Box height={"20px"}></Box>
                <Typography variant='h2'>Loss Exceedance Curve</Typography>
                <LossExceedanceCurve curve={this.state.lossExceedanceCurve} />
              </Box>
            )}
          </Paper>
        </Stack>
      </>
    )
  }
}

export default CalculatorPage;
