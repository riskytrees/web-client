import React from 'react';

import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import { Button } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { NodeRiskResult, RiskyRisk } from './Risk';
import { Label, LibraryAdd } from '@mui/icons-material';
import Paper from "@mui/material/Paper";
import TreePicker from './TreePicker';
import { RiskyApi } from './api';
import TreeData from './interfaces/TreeData';

class AnalysisPane extends React.Component<{
  rootNodeId: string,
  riskEngine: RiskyRisk,
  selectedModel: string;
}, {
  impactfulCounterMeasures: Record<string, number>
}> {
  constructor(props) {
    super(props);
    this.state = { impactfulCounterMeasures: {} };

    this.getSimpleRisk = this.getSimpleRisk.bind(this);
    this.getImpactfulCountermeasures = this.getImpactfulCountermeasures.bind(this);
    this.getTopAttackPath = this.getTopAttackPath.bind(this);
  }

  componentDidMount() {
    this.setState({
      impactfulCounterMeasures: this.props.riskEngine.getMostImpactfulConditions(this.props.selectedModel, this.props.rootNodeId)
    })
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.setState({
        impactfulCounterMeasures: this.props.riskEngine.getMostImpactfulConditions(this.props.selectedModel, this.props.rootNodeId)
      })
    }
  }

  getSimpleRisk() {

    let risk = this.props.riskEngine.computeRiskForNode(this.props.rootNodeId, this.props.selectedModel)

    if (risk) {
      return JSON.stringify(risk.computed);
    }

    return "Unknown"
  }

  getImpactfulCountermeasures() {
    const results: JSX.Element[] = [];

    if (Object.keys(this.state.impactfulCounterMeasures).length > 0) {
      for (const [condition, impact] of Object.entries(this.state.impactfulCounterMeasures)) {
        results.push(<Typography >{condition} - {impact}</Typography>)
      }

      return results;
    }


    return "Unknown"
  }

  getTopAttackPath() {
    const attackPath = this.props.riskEngine.getDominatingAttackPath(this.props.rootNodeId, this.props.selectedModel);

    let result: JSX.Element[] = [];

    for (const pathPart of attackPath) {
      const contribution = pathPart.contribution;
      const displayValue = contribution?.computed[contribution.interface.primary];
      result.push(<Stack sx={{
        justifyContent: "space-between",
        alignItems: "flex-start",
      }} direction="row">
        <Typography>{pathPart.name}</Typography>
        <Typography>{displayValue}</Typography>
      </Stack>)
    }

    return result;
  }


  render() {
    const risk = this.props.riskEngine.computeRiskForNode(this.props.rootNodeId, this.props.selectedModel)

    let likelihoodCard: JSX.Element | null = null;
    if (risk && risk['computed'] && risk['computed']['likelihoodOfSuccess']) {
      likelihoodCard = <Paper>
        <Typography variant="h1">{risk['computed']['likelihoodOfSuccess'] * 100}%</Typography>
        <Typography>Likelihood of Attack</Typography>
      </Paper>
    }

    let riskCard: JSX.Element | null = null;
    if (risk && risk['computed'] && risk['computed']['risk']) {
      riskCard = <Paper>
        <Typography variant="h1">${risk['computed']['risk'] * 100}</Typography>
        <Typography>Risk Attack</Typography>
      </Paper>
    }

    let primaryCard: JSX.Element | null = null;

    // Only use this if the others don't exist
    if (!likelihoodCard && ! riskCard && risk && risk['computed'] && risk['interface']['primary'] && risk['computed'][risk['interface']['primary']]) {
      const primaryKey = risk['interface']['primary'];
      primaryCard = <Paper>
        <Typography variant="h1">{risk['computed'][primaryKey]}</Typography>
        <Typography>{primaryKey}</Typography>
      </Paper>
    }

    return (
      <>
        <Paper variant="rightriskypane">
          <Stack>
            <Typography variant="h1" sx={{ marginBottom: 3 }}>Analysis</Typography>

            {primaryCard}
            {riskCard}
            {likelihoodCard}

            <Paper sx={{ marginTop: 1 }}>
              <Typography variant="h2">Top Attack Path</Typography>
              {this.getTopAttackPath()}
            </Paper>

          </Stack>
        </Paper>



      </>
    );
  }

}

export default AnalysisPane;
