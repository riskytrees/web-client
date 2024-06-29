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
import { LibraryAdd } from '@mui/icons-material';
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


  render() {


    return (
      <>
        <Paper variant="rightriskypane">
          <Stack>
            <Typography variant="h1">Analysis</Typography>

            <Paper>
              <Typography variant="h3">Total Tree Risk:</Typography>
              {this.getSimpleRisk()}
            </Paper>


            <Paper>
              <Typography variant="h3">Most Impactful Countermeasures:</Typography>
              {this.getImpactfulCountermeasures()}
            </Paper>

          </Stack>
        </Paper>



      </>
    );
  }

}

export default AnalysisPane;
