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
    this.handleNodeDescriptionChange = this.handleNodeDescriptionChange.bind(this);

  }

  async handleNodeNameChange(event) {
    await this.setState({
      nodeTitle: event.target.value,
      nodeDescription: this.state.nodeDescription,
      nodeId: this.state.nodeId
    });

    this.triggerOnNodeChanged();
  }

  async handleNodeDescriptionChange(event) {
    await this.setState({
      nodeTitle: this.state.nodeTitle,
      nodeDescription: event.target.value,
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
      <TextField label="Description" onChange={this.handleNodeDescriptionChange} variant="filled" value={this.state.nodeDescription} />

      </Stack>

      </>
    );
  }

}

export default NodePane;
