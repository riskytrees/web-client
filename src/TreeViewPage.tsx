import React from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {Stack} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TreeViewer from './TreeViewer';
import TreeViewPane from './TreeViewPane';
import NodePane from './NodePane';
import TreeData from './interfaces/TreeData';
import { RiskyRisk } from './Risk';

class TreeViewPage extends React.Component<{

}, {
  treeMap: Record<string, TreeData>;
  selectedNode: {
    id: string;
    label: string;
  } | null;
  modalOpen: boolean;
  models: any[];
  selectedModel: string;
}> {
  riskEngine: RiskyRisk;

  constructor(props) {
    super(props);
    this.state = { treeMap: {}, selectedNode: null, modalOpen: false, models: [], selectedModel: "" };
    this.onNodeClicked = this.onNodeClicked.bind(this);
    this.onNodeChanged = this.onNodeChanged.bind(this);
    this.onAddOrDeleteNode = this.onAddOrDeleteNode.bind(this);
    this.localTreeNodeUpdate = this.localTreeNodeUpdate.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.modelDropdownChanged = this.modelDropdownChanged.bind(this);
    this.handleTreeNameChanged = this.handleTreeNameChanged.bind(this);

    this.loadTree()
    this.getListOfModels();
    this.getCurrentModel();

    this.riskEngine = new RiskyRisk(this.state.treeMap, null);
  }

  async getCurrentModel() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');

    let response = await fetch("http://localhost:8000/projects/" + projectId + "/model");
    let data = await response.json();
    this.setState({
      selectedModel: data.result.modelId
    })
  }

  // Only acts on root tree
  async populateModelAttributes(modelId) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const treeId = urlParams.get('id');

    const treeData = JSON.parse(JSON.stringify(this.state.treeMap[treeId]));
    let relevantProperties: string[] = [];

    // For now, add empty attributes for the appropriate model.
    if (modelId === 'b9ff54e0-37cf-41d4-80ea-f3a9b1e3af74') {
      // Attacker likelihood
      relevantProperties = ['likelihoodOfSuccess'];
    } else if (modelId === 'f1644cb9-b2a5-4abb-813f-98d0277e42f2') {
      // Risk of Attack
      for (const [idx, node] of treeData.nodes.entries()) {
        relevantProperties =  ['likelihoodOfSuccess', 'impactToDefender']
      }
    } else if (modelId === 'bf4397f7-93ae-4502-a4a2-397f40f5cc49') {
      // EVITA
      relevantProperties = ['safetyImpact', 'financialImpact', 'privacyImpact', 'operationalImpact'];
      relevantProperties.concat(['time', 'expertise', 'knowledge', 'windowOfOpportunity', 'equipmentRequired']);
    }

    for (const [idx, node] of treeData.nodes.entries()) {
      for (const modelProp of relevantProperties) {
        if (treeData.nodes[idx]['modelAttributes'][modelProp] === undefined) {
          treeData.nodes[idx]['modelAttributes'][modelProp] = {
            value_int: null,
            value_float: null,
            value_string: null
          };
        }
      }
    }

    const treeMap = this.state.treeMap;
    treeMap[treeId] = treeData;

    this.setState({
      treeMap: treeMap
    }, () => this.updateTree(treeId) );
  }

  async loadTree() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let response = await fetch("http://localhost:8000/projects/" + projectId + "/trees/" + treeId);
    let data = await response.json();
    const treeMap = {};
    treeMap[treeId] = data.result;
    this.setState({
      treeMap
    }, () => {
      this.riskEngine = new RiskyRisk(this.state.treeMap, treeId);
    })
    
  }

  // Called when any portion of the tree is updated and needs to be synced
  async updateTree(treeIdToUpdate: string) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');


    this.riskEngine = new RiskyRisk(this.state.treeMap, treeId);


    let response = await fetch("http://localhost:8000/projects/" + projectId + "/trees/" + treeId, {
      method: 'PUT',

      body: JSON.stringify(this.state.treeMap[treeIdToUpdate])
    });

  }

  localTreeNodeUpdate(treeIdToUpdate: string, newNodeData) {
    for (const [idx, node] of this.state.treeMap[treeIdToUpdate].nodes.entries()) {
      if (node.id === newNodeData.id) {
        const treeData = JSON.parse(JSON.stringify(this.state.treeMap[treeIdToUpdate]));
        treeData.nodes[idx]['title'] = newNodeData['title'];
        treeData.nodes[idx]['description'] = newNodeData['description'];
        treeData.nodes[idx]['modelAttributes'] = newNodeData['modelAttributes'];
        treeData.nodes[idx]['conditionAttribute'] = newNodeData['conditionAttribute'];
        const treeMap = this.state.treeMap;
        treeMap[treeIdToUpdate] = treeData;
        console.log("Tree Update")
        console.log(treeData)
        this.setState({
          treeMap: treeMap,
          selectedNode: this.state.selectedNode
        }, () => this.updateTree(treeIdToUpdate));
      }
    }
  }

  onNodeClicked(data) {
    console.log(data)
    this.setState({
      selectedNode: data
    });
  }

  onNodeChanged(treeIdToUpdate: string, data) {
    this.localTreeNodeUpdate(treeIdToUpdate, data)
  }

  onAddOrDeleteNode(treeIdToUpdate: string, parentNodeId, isAddAction) {
    const treeData = JSON.parse(JSON.stringify(this.state.treeMap[treeIdToUpdate]));
    let uuid = crypto.randomUUID();

    if (isAddAction && parentNodeId || isAddAction && treeData.nodes.length === 0) {
      treeData['nodes'].push({
        title: "New Node",
        description: "",
        modelAttributes: {},
        conditionAttribute: "",
        id: uuid,
        children: []
      });
  
    }

    let nodeToDelete = null;

    for (const [idx, node] of treeData.nodes.entries()) {
      if (node.id === parentNodeId) {
        if (isAddAction) {
          treeData.nodes[idx]['children'].push(uuid);
        } else if (node.id !== treeData.rootNodeId) {
          // Delete
          if (treeData.nodes[idx]['children'].length === 0) {
            nodeToDelete = idx;
          }
        }
      }
    }

    if (nodeToDelete !== null) {
      for (const [idx, node] of treeData.nodes.entries()) {
        if (node.children.includes(parentNodeId)) {
          treeData.nodes[idx]['children'] = treeData.nodes[idx]['children'].filter(item => item !== parentNodeId);
        }
      }

      treeData.nodes.splice(nodeToDelete, 1);
    }

    const treeMap = this.state.treeMap;
    treeMap[treeIdToUpdate] = treeData;

    this.setState({
      treeMap: treeMap,
      selectedNode: this.state.selectedNode
    }, () => this.updateTree(treeIdToUpdate) );
  }

  handleOpen() {
   this.setState({modalOpen: true})
  }

  handleClose() {
    this.setState({modalOpen: false})
  }

  async getListOfModels() {

    let response = await fetch("http://localhost:8000/models/");
    let data = await response.json();
    this.setState({
      models: data.result.models
    })
  }

  modelDropdownChanged(event) {
    this.updateModel(event.target.value)
  };

  async updateModel(modelId) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let response = await fetch("http://localhost:8000/projects/" + projectId + "/model", {
      method: 'PUT',
      body: JSON.stringify({
        modelId: modelId
      })
    });
    this.setState({
      selectedModel: modelId
    }, () => {
      this.populateModelAttributes(modelId);
    })

    
  }

  handleTreeNameChanged(event) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const treeId = urlParams.get('id');

    const proposedName = event.target.value;
    const treeData = JSON.parse(JSON.stringify(this.state.treeMap[treeId]));

    treeData.title = proposedName;

    const treeMap = this.state.treeMap;
    treeMap[treeId] = treeData;

    this.setState({
      treeMap: treeMap
    }, () => this.updateTree(treeId) );

  }

  getTreeName() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const treeId = urlParams.get('id');

    if (this.state.treeMap[treeId]) {
      return this.state.treeMap[treeId].title;
    }
  
    return "";
  }

  render() {
    const modelDropdownItems: JSX.Element[] = [];

    if (this.state.models) {
      for (const [idx, model] of this.state.models.entries()) {
        modelDropdownItems.push(<MenuItem key={model.id} value={model.id}>{model.title}</MenuItem>)
      }
    }

    return (
      <>
      
        
        <AppBar>
          <Box display="flex" justifyContent="center" alignItems="center" marginTop="11.75px">
            <Button id="treeNameSelect" onClick={this.handleOpen} variant="text" endIcon={<ArrowDropDownIcon />}>{this.getTreeName()}</Button>
          </Box>

          <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >

          <Box id="treeSelectCenter">
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <TextField label="Tree Name" variant="outlined" size="small" onChange={this.handleTreeNameChanged} defaultValue={this.getTreeName()} />
          <Select
            labelId="config-dropdown-label"
            id="config-dropdown"
            value={null}
            label="Config"
            size="small"
            onChange={undefined}
          >
            <MenuItem value={10}>Config One</MenuItem>
            <MenuItem value={20}>Config Two</MenuItem>
            <MenuItem value={30}>Config Three</MenuItem>
          </Select>

          <Select
            labelId="model-dropdown-label"
            id="model-dropdown"
            value={this.state.selectedModel}
            label="Config"
            size="small"
            onChange={this.modelDropdownChanged}
          >
            {modelDropdownItems}
            
          </Select>
          </Stack>
          </Box>

        </Modal>

        </AppBar>

          <Stack direction="row">
            <Paper variant="riskypane">
              <TreeViewPane nodes={this.state.treeMap && Object.values(this.state.treeMap).length > 0 ? Object.values(this.state.treeMap)[0].nodes : []}/>
            </Paper>
            {this.state.treeMap && Object.values(this.state.treeMap).length > 0 && Object.values(this.state.treeMap)[0].nodes && <TreeViewer onNodeClicked={this.onNodeClicked} treeData={Object.values(this.state.treeMap)[0]} /> }

            <Paper variant="riskypane">
              {
              <NodePane triggerAddDeleteNode={this.onAddOrDeleteNode} onNodeChanged={this.onNodeChanged} currentNode={this.state.selectedNode} currentNodeRisk={this.riskEngine.computeRiskForNode(this.state.selectedNode ? this.state.selectedNode.id : null , this.state.selectedModel)}/>
              }
            </Paper>
          </Stack>
      </>
    )
  }
}

export default TreeViewPage;
