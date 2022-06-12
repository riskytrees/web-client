import CreateTreeWidget from './CreateTreeWidget';
import TreesList from './TreesList';
import React from 'react';

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

import { Button } from '@mui/material';

import Stack from "@mui/material/Stack";

class NodePane extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nodeId: null, nodeTitle: '', nodeDescription: '', modelAttributes: null };

    this.handleNodeNameChange = this.handleNodeNameChange.bind(this);
    this.handleNodeDescriptionChange = this.handleNodeDescriptionChange.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleAddNode = this.handleAddNode.bind(this);
    this.handleDeleteNode = this.handleDeleteNode.bind(this);
  }

  async handleAddNode(event) {
    if (this.props.triggerAddDeleteNode) {
      this.props.triggerAddDeleteNode(this.state.nodeId, true);
    }
  }

  async handleDeleteNode(event) {
    if (this.props.triggerAddDeleteNode) {
      this.props.triggerAddDeleteNode(this.state.nodeId, false);
    }
  }

  async handleNodeNameChange(event) {
    await this.setState({
      nodeTitle: event.target.value,
      nodeDescription: this.state.nodeDescription,
      nodeId: this.state.nodeId,
      modelAttributes: this.state.modelAttributes
    });

    this.triggerOnNodeChanged();
  }

  async handleNodeDescriptionChange(event) {
    await this.setState({
      nodeTitle: this.state.nodeTitle,
      nodeDescription: event.target.value,
      nodeId: this.state.nodeId,
      modelAttributes: this.state.modelAttributes
    });

    this.triggerOnNodeChanged();
  }

  async handleAttributeChange(event) {
    const newModelAttributes = { ...this.state.modelAttributes };

    if (newModelAttributes[event.target.id]['value_string']) {
      newModelAttributes[event.target.id]['value_string'] = event.target.value;
    } else if (newModelAttributes[event.target.id]['value_int']) {
      newModelAttributes[event.target.id]['value_int'] = Number(event.target.value);
    } else if (newModelAttributes[event.target.id]['value_float']) {
      newModelAttributes[event.target.id]['value_float'] = Number(event.target.value);
    }

    this.setState({
      nodeTitle: this.state.nodeTitle,
      nodeDescription: this.state.nodeDescription,
      nodeId: this.state.nodeId,
      modelAttributes: newModelAttributes
    });

    this.triggerOnNodeChanged();

  }

  triggerOnNodeChanged() {
    if (this.props.onNodeChanged) {
      this.props.onNodeChanged({
        title: this.state.nodeTitle,
        description: this.state.nodeDescription,
        id: "" + this.state.nodeId,
        modelAttributes: this.state.modelAttributes
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
          nodeId: "" + this.props.currentNode.id,
          modelAttributes: this.props.currentNode.modelAttributes
        });
      }
    }
  }

  getAttributeValue(valueDict) {
    if (valueDict) {
      if (valueDict['value_string']) {
        return "" + valueDict['value_string'];
      } else if (valueDict['value_int']) {
        return Number(valueDict['value_int']);
      } else if (valueDict['value_float']) {
        return Number(valueDict['value_float']);
      }
    }
    

    return "Error"
  }
 
  renderAttributes() {
    const attributes = [];

    if (this.state.modelAttributes) {
      for (const [key, value] of Object.entries(this.state.modelAttributes)) {
        attributes.push(
          <TextField id={key} key={key} label={key} onChange={this.handleAttributeChange} variant="filled" value={this.getAttributeValue(value)} />
        )
      }
    }

    return attributes;
  }

  render() {
    return (
      <>
      <Stack>
      <TextField label="Node Name" onChange={this.handleNodeNameChange} variant="filled" value={this.state.nodeTitle} />
      <TextField label="Description" onChange={this.handleNodeDescriptionChange} variant="filled" value={this.state.nodeDescription} />
      <div>{this.renderAttributes()}</div>
      <Button onClick={this.handleAddNode}>Add Node</Button>
      <Button onClick={this.handleDeleteNode}>Delete Node</Button>

      </Stack>

      </>
    );
  }

}

export default NodePane;
