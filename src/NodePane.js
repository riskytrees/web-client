import CreateTreeWidget from './CreateTreeWidget';
import TreesList from './TreesList';
import React from 'react';

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

import Stack from "@mui/material/Stack";

class NodePane extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nodeId: null, nodeTitle: '', nodeDescription: '' };

    this.handleNodeNameChange = this.handleNodeNameChange.bind(this);
  }

  async handleNodeNameChange(event) {
    await this.setState({
      nodeTitle: event.target.value,
      nodeDescription: this.state.nodeDescription,
      nodeId: this.state.nodeId
    });

    this.triggerOnNodeChanged();
  }

  triggerOnNodeChanged() {
    if (this.props.onNodeChanged) {
      this.props.onNodeChanged({
        title: this.state.nodeTitle,
        description: this.state.nodeDescription,
        id: "" + this.state.nodeId
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if (this.props.currentNode) {
        console.log(this.props.currentNode)

        this.setState({
          nodeTitle: "" + this.props.currentNode.label,
          nodeDescription: "" + this.props.currentNode.description,
          nodeId: "" + this.props.currentNode.id
        });
      }
    }
  }

  render() {
    return (
      <>
      <Stack>
      <TextField label="Node Name" onChange={this.handleNodeNameChange} variant="filled" value={this.state.nodeTitle} />
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
      <TextField label="Description" variant="filled" />

      </Stack>

      </>
    );
  }

}

export default NodePane;
