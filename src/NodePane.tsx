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
import { NodeRiskResult } from './Risk';
import { LibraryAdd } from '@mui/icons-material';
import Paper from "@mui/material/Paper";
import TreePicker from './TreePicker';
import { RiskyApi } from './api';

class NodePane extends React.Component<{
  currentNode: Record<string, any>;
  triggerAddDeleteNode: Function;
  onNodeChanged: Function;
  currentNodeRisk: NodeRiskResult;
  selectedModel: string;
}, {
  nodeId: string | null;
  nodeTitle: string;
  nodeDescription: string;
  modelAttributes: any | null;
  conditionAttribute: string;
  showSubtreeDialog: boolean;
  selectedTreeId: string | null;
}> {
  constructor(props) {
    super(props);
    this.state = { nodeId: null, nodeTitle: '', nodeDescription: '', modelAttributes: null, conditionAttribute: '', showSubtreeDialog: false, selectedTreeId: null };

    this.handleNodeNameChange = this.handleNodeNameChange.bind(this);
    this.handleNodeDescriptionChange = this.handleNodeDescriptionChange.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleAddNode = this.handleAddNode.bind(this);
    this.handleDeleteNode = this.handleDeleteNode.bind(this);
    this.createAttribute = this.createAttribute.bind(this);
    this.getNodeType = this.getNodeType.bind(this);
    this.nodeTypeDropdownChanged = this.nodeTypeDropdownChanged.bind(this);
    this.isConditionNode = this.isConditionNode.bind(this);
    this.getConditionValue = this.getConditionValue.bind(this);
    this.handleConditionFieldChanged = this.handleConditionFieldChanged.bind(this);
    this.handleAddSubtree = this.handleAddSubtree.bind(this);
    this.canceledSubtreeCallback = this.canceledSubtreeCallback.bind(this);
    this.pickedSubtreeCallback = this.pickedSubtreeCallback.bind(this);
    this.addAttributesBasedOnSelectedModel = this.addAttributesBasedOnSelectedModel.bind(this);
    this.loadTreeIdForThisNode = this.loadTreeIdForThisNode.bind(this);
  }

  async getTreeIdFromNodeId(nodeId: string) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/nodes/" + nodeId, {});
    return data['result']['treeId'];
  }

  async handleAddNode(event) {
    if (this.props.triggerAddDeleteNode) {
      this.props.triggerAddDeleteNode(this.state['selectedTreeId'], this.state.nodeId, true);
    }
  }

  async handleDeleteNode(event) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    
    if (this.props.triggerAddDeleteNode) {
      let relevantTreeId = this.state['selectedTreeId'];

      if (treeId !== this.state.selectedTreeId) {
        // This is a subtree node
        relevantTreeId = treeId;
      }
      this.props.triggerAddDeleteNode(relevantTreeId, this.state.nodeId, false);
    }
  }

  async handleAddSubtree(event) {
    this.setState({
      showSubtreeDialog: true
    })
  }

  async pickedSubtreeCallback(nodeId: string) {
    if (this.props.triggerAddDeleteNode) {
      this.props.triggerAddDeleteNode(this.state['selectedTreeId'], this.state.nodeId, true, nodeId);
    }

  }

  async canceledSubtreeCallback() {
    this.setState({
      showSubtreeDialog: false
    })
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

    
    if (event.target.value === '' || Number.isNaN(Number(event.target.value)) || event.target.value.endsWith('.')) {
      newModelAttributes[event.target.id] = {'value_string': event.target.value, 'value_int': null, 'value_float': null};
    } else if (Number.isInteger(Number(event.target.value)) && !event.target.value.includes('.')) {
      newModelAttributes[event.target.id] = {'value_string': null, 'value_int': Number(event.target.value), 'value_float': null};
    } else {
      newModelAttributes[event.target.id] = {'value_string': null, 'value_int': null, 'value_float': Number(event.target.value)};
    }


    this.setState({
      nodeTitle: this.state.nodeTitle,
      nodeDescription: this.state.nodeDescription,
      nodeId: this.state.nodeId,
      modelAttributes: newModelAttributes,
      conditionAttribute: this.state.conditionAttribute
    }, () => this.triggerOnNodeChanged() );


  }

  async triggerOnNodeChanged() {
    if (this.props.onNodeChanged && this.state.nodeId && this.state.selectedTreeId) {
      try {
        const treeId = this.state['selectedTreeId'];

        this.props.onNodeChanged(treeId, {
          title: this.state.nodeTitle,
          description: this.state.nodeDescription,
          id: "" + this.state.nodeId,
          modelAttributes: this.state.modelAttributes,
          conditionAttribute: this.state.conditionAttribute
        });
      } catch (err) {
        console.log(err);
      }

    }
  }

  componentDidLoad() {

  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if (this.props.currentNode) {
        this.setState({
          nodeTitle: "" + this.props.currentNode.label,
          nodeDescription: "" + this.props.currentNode.description,
          nodeId: "" + this.props.currentNode.id,
          modelAttributes: this.props.currentNode.modelAttributes,
          conditionAttribute: this.props.currentNode.conditionAttribute,
        }, () => {
          this.loadTreeIdForThisNode();
        });
      } else {
        this.setState({
          nodeTitle: "",
          nodeDescription: "",
          nodeId: "",
          modelAttributes: {},
          conditionAttribute: "",
          showSubtreeDialog: false
        });

      }
    }
  }

  getAttributeValue(valueDict) {
    if (valueDict) {
      if (valueDict['value_string']) {
        return "" + valueDict['value_string'];
      } else if (typeof(valueDict['value_int']) === 'number') {
        return Number(valueDict['value_int']);
      } else if (typeof(valueDict['value_float']) === 'number') {
        let tentative = '' + Number(valueDict['value_float']);
        if (!tentative.includes('.')) {
          tentative += '.0'
        }
        return tentative;
      }
    }
    

    return '';
  }

  getAttributesRelevantToModel() {
    let relevantAttributes: string[] = [];

    // For now, add empty attributes for the appropriate model.
    if (this.props.selectedModel === 'b9ff54e0-37cf-41d4-80ea-f3a9b1e3af74') {
      // Attacker likelihood
      relevantAttributes = ['likelihoodOfSuccess'];
    } else if (this.props.selectedModel === 'f1644cb9-b2a5-4abb-813f-98d0277e42f2') {
      // Risk of Attack
      relevantAttributes = ['likelihoodOfSuccess', 'impactToDefender']
    } else if (this.props.selectedModel === 'bf4397f7-93ae-4502-a4a2-397f40f5cc49') {
      // EVITA
      relevantAttributes = ['safetyImpact', 'financialImpact', 'privacyImpact', 'operationalImpact'];
      relevantAttributes.concat(['time', 'expertise', 'knowledge', 'windowOfOpportunity', 'equipmentRequired']);
    }

    return relevantAttributes;
  }

  addAttributesBasedOnSelectedModel() {
    
    if (this.props.selectedModel && this.props.selectedModel !== "") {
      let relevantAttributes: string[] = this.getAttributesRelevantToModel();

      for (const attribute of relevantAttributes) {
        if (!this.state.modelAttributes[attribute] || this.state.modelAttributes[attribute] == '') {
          // Add attribute
          this.handleAttributeChange({ target: { id: attribute, value: '' } });
        }
      }

    }
  }
 
  renderAttributes() {
    this.addAttributesBasedOnSelectedModel();

    const attributes: JSX.Element[] = [];
    const attributesToIgnore = ['node_type'];
    const relevantAttributes: string[] = this.getAttributesRelevantToModel();

    if (this.state.modelAttributes) {
      for (const [key, value] of Object.entries(this.state.modelAttributes)) {
        if (relevantAttributes.includes(key)) {
          attributes.push(
            <Grid key={"container_" + key} container spacing={1}>
              <Grid key={"item_" + key} item xs={9} >
                <TextField id={key} key={key}  sx={{
          marginBottom: '10px',
        }} label={key} onChange={this.handleAttributeChange} variant="outlined" size="small" value={this.getAttributeValue(value)} /> 
  
              </Grid>      
              <Grid item xs={3}>
                <IconButton onClick={() => {
                  this.deleteAttribute(key);
                }}><DeleteIcon /></IconButton>
  
              </Grid>      
  
            </Grid>
          )
        }
      }
    }

    return attributes;
  }

  renderAddDeleteFields() {
    return (
      <>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField label="Name" variant="outlined" size="small" id='newAttributeNameField' />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Value" variant="outlined" size="small" id='newAttributeValueField' />
        </Grid>
        
        <Grid item xs={12}>
          <Button fullWidth={true} variant="addButton" startIcon={<AddIcon />} onClick={this.createAttribute}>Add Attribute</Button>
        </Grid>
        <Grid item xs={2}> </Grid>

      </Grid>      

      </>
    )
  }

  createAttribute() {
    const newAttributeNameField = document.getElementById('newAttributeNameField') as HTMLInputElement;
    const newAttributeValueField = document.getElementById('newAttributeValueField') as HTMLInputElement;

    if (newAttributeNameField && newAttributeValueField) {
      this.handleAttributeChange({ target: { id: newAttributeNameField.value, value: newAttributeValueField.value } });
    }
  }

  deleteAttribute(key) {
    const newModelAttributes = { ...this.state.modelAttributes };

    delete newModelAttributes[key];

    this.setState({
      nodeTitle: this.state.nodeTitle,
      nodeDescription: this.state.nodeDescription,
      nodeId: this.state.nodeId,
      modelAttributes: newModelAttributes
    }, () => this.triggerOnNodeChanged() );
  }

  getNodeType() {
    if (this.state.modelAttributes && this.state.modelAttributes['node_type']) {
      return this.state.modelAttributes['node_type']['value_string'];
    }

    return '';
  }

  getConditionValue() {
    if (this.state.conditionAttribute) {
      return this.state.conditionAttribute;
    }

    return null;
  }

  nodeTypeDropdownChanged(event) {
    const newType = event.target.value;

    this.handleAttributeChange({
      target: {
        id: 'node_type',
        value: newType
      }
    }).then(res => {
      if (newType === 'condition' && !this.getConditionValue()) {
        this.handleAttributeChange({
          target: {
            id: 'condition_value',
            value: ''
          }
        })
      }
    })
  }

  isConditionNode() {
    const nodeType = this.getNodeType();

    return (nodeType === 'condition');
  }

  handleConditionFieldChanged(event) {
    const newCondition = event.target.value;

    this.setState({
      conditionAttribute: newCondition
    }, () => this.triggerOnNodeChanged() );
  }

  renderConditionSettingsIfApplicable() {
    if (this.isConditionNode()) {
      return <TextField label="Condition" onChange={this.handleConditionFieldChanged}  variant="outlined" size="small" value={this.getConditionValue()} />
    }

    return null;
  }

  async loadTreeIdForThisNode() {
    if (this.state.nodeId) {
      this.setState({
        selectedTreeId: await this.getTreeIdFromNodeId(this.state.nodeId)
      })  
    }
  }

  render() {
    if (!this.state.nodeId) {
      return null;
    }

    return (
      <>
      <Paper variant="rightriskypane">
      <Stack>
      <Typography variant="h3">Details</Typography>
      <Box height={"10px"}></Box>

      <TextField label="Node Name" onChange={this.handleNodeNameChange}  variant="outlined" size="small" value={this.state.nodeTitle} />
      <Box height={"20px"}></Box>
      <FormControl size="small">
        <InputLabel id="node-type-dropdown-label">Node Type</InputLabel>
      <Select
            labelId="node-type-dropdown-label"
            id="node-type-dropdown"
            value={this.getNodeType()}
            label="Node Type"
            variant="outlined" 
            size="small" 
            onChange={this.nodeTypeDropdownChanged}
      >
            <MenuItem value={"and"}>And</MenuItem>
            <MenuItem value={"or"}>Or</MenuItem>
            <MenuItem value={"condition"}>Condition</MenuItem>

      </Select>
        </FormControl>
      <Box height={"20px"}></Box>

      <TextField InputProps={{
            readOnly: true,
          }} label="Computed Risk"  variant="outlined" size="small" value={this.props.currentNodeRisk ? this.props.currentNodeRisk.computed[this.props.currentNodeRisk.interface['primary']] : ''}></TextField>

      <Box height={"20px"}></Box>
      <Typography variant="h3">Node Attributes</Typography>
      <Box height={"10px"}></Box>
      <div>{this.renderConditionSettingsIfApplicable()}</div>


      <div>{this.renderAttributes()}</div>

      {this.renderAddDeleteFields()}

      <Box height={"5px"}></Box>
      <Typography variant="h3">Other</Typography>
      <Box height={"10px"}></Box>
      <TextField label="Description" onChange={this.handleNodeDescriptionChange} multiline variant="outlined" rows="3" size="small" value={this.state.nodeDescription} />
      <Box height={"20px"}></Box>

      <Button variant="addButton" startIcon={<AddIcon />} onClick={this.handleAddNode}>Add Node</Button>
      <Box height={"5px"}></Box>
      <Button variant="addButton" startIcon={<LibraryAdd />} onClick={this.handleAddSubtree}>Add Subtree</Button>
      <TreePicker enabled={this.state.showSubtreeDialog} onSubmit={this.pickedSubtreeCallback} onCancel={this.canceledSubtreeCallback}></TreePicker>
      <Box height={"5px"}></Box>
      <Button variant="deleteButton" startIcon={<DeleteIcon />} onClick={this.handleDeleteNode}>Delete Node</Button>
      <Box height={"5px"}></Box>
      <Typography variant="caption">Node ID: {this.state.nodeId}</Typography>

      </Stack>
      </Paper>



      </>
    );
  }

}

export default NodePane;
