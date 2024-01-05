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
}> {
  constructor(props) {
    super(props);
    this.state = {  };

    this.getSimpleRisk = this.getSimpleRisk.bind(this);
  }

  componentDidLoad() {

  }

  componentDidUpdate(prevProps) {
  }

  getSimpleRisk() {

    let risk = this.props.riskEngine.computeRiskForNode(this.props.rootNodeId, this.props.selectedModel)

    if (risk) {
      return JSON.stringify(risk.computed);
    }

    return "Unknown"
  }


  render() {

    return (
      <>
        <Paper variant="rightriskypane">
          <Stack>
            <Typography variant="h1">Analysis</Typography>
            Total Tree Risk: {this.getSimpleRisk()}

          </Stack>
        </Paper>



      </>
    );
  }

}

export default AnalysisPane;
