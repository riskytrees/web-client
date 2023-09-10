import React from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Toolbar from "@mui/material/Toolbar";
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Divider, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TreeViewer from './TreeViewer';
import NodePane from './NodePane';
import TreeData from './interfaces/TreeData';
import { RiskyRisk } from './Risk';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import SubTreePane from './SubTreePane';
import ConfigPicker from './ConfigPicker';
import { RiskyApi } from './api';
import Item from '@mui/material/Grid';
import AnalysisPane from './AnalysisPane';

class TreeViewPage extends React.Component<{

}, {
  treeMap: Record<string, TreeData>;
  selectedNode: {
    id: string;
    label: string;
  } | null;
  modalOpen: boolean;
  actionModalOpen: boolean;
  models: any[];
  selectedModel: string;
  analysisModeEnabled: boolean;
}> {
  riskEngine: RiskyRisk;

  constructor(props) {
    super(props);
    this.state = { treeMap: {}, selectedNode: null, modalOpen: false, actionModalOpen: false, models: [], selectedModel: "", analysisModeEnabled: false };
    this.onNodeClicked = this.onNodeClicked.bind(this);
    this.onNodeChanged = this.onNodeChanged.bind(this);
    this.onAddOrDeleteNode = this.onAddOrDeleteNode.bind(this);
    this.localTreeNodeUpdate = this.localTreeNodeUpdate.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleActionPanelOpen = this.handleActionPanelOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleActionPanelClose = this.handleActionPanelClose.bind(this);
    this.modelDropdownChanged = this.modelDropdownChanged.bind(this);
    this.handleTreeNameChanged = this.handleTreeNameChanged.bind(this);
    this.handleAnalysisClicked = this.handleAnalysisClicked.bind(this);
    this.goBackToProjects = this.goBackToProjects.bind(this);

    this.loadTree()
    this.getListOfModels();
    this.getCurrentModel();

    this.riskEngine = new RiskyRisk(this.state.treeMap, null);
  }

  async getCurrentModel() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/model", {});

    if (data.ok) {
      this.setState({
        selectedModel: data.result.modelId
      })
    }
  }

  goBackToProjects() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');


    window.location.href = '/projects?id=' + projectId;
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
        relevantProperties = ['likelihoodOfSuccess', 'impactToDefender']
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
    }, () => this.updateTree(treeId));
  }

  async resolveImports(treeData: TreeData, projectId: string) {
    const nodesOfConcern = treeData.nodes.map(node => node.id);
    let children = treeData.nodes.reduce((prev, curr) => prev.concat(curr.children), [])
    children = [...new Set(children)];

    const childrenToResolve = children.filter(child => nodesOfConcern.indexOf(child) === -1)

    let result = {}

    for (const childId of childrenToResolve) {
      let treeData = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/nodes/" + childId, {});

      if (treeData.ok === true) {
        let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees/" + treeData.result.treeId, {});
  
        result[treeData.result.treeId] = data.result;
        result = { ...result, ...(await this.resolveImports(data.result, projectId)) };
      }
    }

    return result;
  }

  async loadTree() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees/" + treeId, {});

    if (data.ok) {
      let treeMap = {};
      treeMap[treeId] = data.result;
  
      // Recursively resolve tree imports
      const result = await this.resolveImports(data.result, projectId);
      treeMap = { ...treeMap, ...result };
  
      this.setState({
        treeMap
      }, () => {
        this.riskEngine = new RiskyRisk(this.state.treeMap, treeId);
      })
    }
  }

  // Called when any portion of the tree is updated and needs to be synced
  async updateTree(treeIdToUpdate: string, reloadAll: boolean = false) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    this.riskEngine = new RiskyRisk(this.state.treeMap, treeId);

    let response = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees/" + treeIdToUpdate, {
      method: 'PUT',
      body: JSON.stringify(this.state.treeMap[treeIdToUpdate])
    })

    if (reloadAll) {
      await this.loadTree();
    }

  }

  localTreeNodeUpdate(treeIdToUpdate: string, newNodeData) {
    console.log(this.state.treeMap)
    console.log(treeIdToUpdate)
    for (const [idx, node] of this.state.treeMap[treeIdToUpdate].nodes.entries()) {
      if (node.id === newNodeData.id) {
        const treeData = JSON.parse(JSON.stringify(this.state.treeMap[treeIdToUpdate]));
        treeData.nodes[idx]['title'] = newNodeData['title'];
        treeData.nodes[idx]['description'] = newNodeData['description'];
        treeData.nodes[idx]['modelAttributes'] = newNodeData['modelAttributes'];
        treeData.nodes[idx]['conditionAttribute'] = newNodeData['conditionAttribute'];
        const treeMap = { ...this.state.treeMap };
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

  onAddOrDeleteNode(treeIdToUpdate: string, parentNodeId, isAddAction, subtreeNodeId: string | null = null) {
    if (this.state.treeMap[treeIdToUpdate]) {
      const treeData = JSON.parse(JSON.stringify(this.state.treeMap[treeIdToUpdate]));
      let uuid = crypto.randomUUID();
      
     
      if (isAddAction && !subtreeNodeId && parentNodeId || isAddAction && treeData.nodes.length === 0) {
        treeData['nodes'].push({
          title: "New Node",
          description: "",
          modelAttributes: {
            "node_type": {
              "value_string": "or"
            }
          },
          conditionAttribute: "",
          id: uuid,
          children: []
        });
      }
  
      let nodeToDelete = null;
  
      for (const [idx, node] of treeData.nodes.entries()) {
        if (node.id === parentNodeId) {
          
          if (subtreeNodeId) {
            treeData.nodes[idx]['children'].push(subtreeNodeId);
          }
          else if (isAddAction) {
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
  
      const treeMap = structuredClone(this.state.treeMap);
      treeMap[treeIdToUpdate] = treeData;
  
      this.setState({
        treeMap: treeMap,
        selectedNode: this.state.selectedNode
      }, () => this.updateTree(treeIdToUpdate, subtreeNodeId !== null));
  
    } else {
      console.log("No tree map!")
    }
  }

  handleOpen() {
    this.setState({ modalOpen: true })
  }

  handleActionPanelOpen() {
    this.setState({actionModalOpen: true})
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }

  handleActionPanelClose() {
    this.setState({ actionModalOpen: false })
  }

  async getListOfModels() {
    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/models", {});

    if (data.ok) {
      this.setState({
        models: data.result.models
      })
    }
  }

  modelDropdownChanged(event) {
    this.updateModel(event.target.value)
  };

  async updateModel(modelId) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let response = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/model", {
      method: 'PUT',
      body: JSON.stringify({
        modelId: modelId
      })
    })

    this.setState({
      selectedModel: modelId
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
    }, () => this.updateTree(treeId));

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

  handleAnalysisClicked(event) {
    console.log("Analysis Clicked")

    if (this.state.analysisModeEnabled) {
      this.setState({
        analysisModeEnabled: false
      });
    } else {
      this.setState({
        analysisModeEnabled: true
      });
    }
  }

  render() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const treeId = urlParams.get('id');
    const projectId = urlParams.get('projectId');

    const modelDropdownItems: JSX.Element[] = [];

    if (this.state.models) {
      for (const [idx, model] of this.state.models.entries()) {
        modelDropdownItems.push(<MenuItem key={model.id} value={model.id}>{model.title}</MenuItem>)
      }
    }

    let modelDropdown = null;

    if (this.state.treeMap) {
      modelDropdown =                 <FormControl size="small">
                <InputLabel id="node-type-dropdown-label">Model</InputLabel>
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
              </FormControl>
    }

    let rightPane: JSX.Element = <NodePane selectedModel={this.state.selectedModel} triggerAddDeleteNode={this.onAddOrDeleteNode} onNodeChanged={this.onNodeChanged} currentNode={this.state.selectedNode} currentNodeRisk={this.riskEngine.computeRiskForNode(this.state.selectedNode ? this.state.selectedNode.id : null, this.state.selectedModel)} />;

    if (this.state.analysisModeEnabled) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
  
      const treeId = urlParams.get('id');

      rightPane = <AnalysisPane  rootNodeId={this.state.treeMap[treeId].rootNodeId} riskEngine={this.riskEngine} selectedModel={this.state.selectedModel}></AnalysisPane>
    }

    return (
      <>


        <AppBar>
          <Grid container>
            <Grid item xs={4} marginTop="11.75px">
              <Stack spacing={2} direction="row">
                <Box></Box>
                <Button aria-describedby="actionButton" onClick={this.handleActionPanelOpen} variant='inlineNavButton' endIcon={<ArrowDropDownIcon />}> Action Panel </Button>
                <Popover
                  id="actionButton"
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: 50, left: 0 }}
                  open={this.state.actionModalOpen}
                  onClose={this.handleActionPanelClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >
                  <Stack>
                  <List component="nav">
                    <ListItem>
                      <ListItemButton onClick={this.goBackToProjects}>
                        <ListItemText primary="Back to Trees" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem>
                      <ListItemButton disabled={true}>
                        <ListItemText primary="Export Text Tree" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem>
                      <ListItemButton disabled={true}>
                        <ListItemText primary="Export Analysis" />
                      </ListItemButton>
                    </ListItem>

                    <Divider light />

                    <ListItem>
                      <ListItemButton disabled={true}>
                        <ListItemText primary="Add Child Node" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem>
                      <ListItemButton disabled={true}>
                        <ListItemText primary="Delete Selected" />
                      </ListItemButton>
                    </ListItem>

                    <Divider light />
                    <ListItem>
                      <ListItemButton disabled={true}>
                        <ListItemText primary="Config Settings" />
                      </ListItemButton>
                    </ListItem>

                    <ListItem>
                      <ListItemButton disabled={true}>
                        <ListItemText primary="Model Settings" />
                      </ListItemButton>
                    </ListItem>

                    <Divider light />
                    <ListItem>
                      <ListItemButton disabled={true}>
                        <ListItemText primary="App Settings" />
                      </ListItemButton>
                    </ListItem>

                  </List>
                  </Stack>

                </Popover>
              </Stack>
            </Grid>

            <Grid item xs={4} marginTop="11.75px">
              <Stack alignContent="center">
                <Button variant='inlineNavButton' onClick={this.handleOpen} endIcon={<ArrowDropDownIcon />}>{this.getTreeName()}</Button>
              </Stack>
            </Grid>



            <Grid item xs={4}  marginTop="11.75px">
              <Stack spacing={2} direction="row" justifyContent="flex-end">
                <Button onClick={this.handleAnalysisClicked}> {this.state.analysisModeEnabled ? "Close Analysis" : "Show Analysis"} </Button>
                <Box></Box>
              </Stack>
             
              
            </Grid>
          </Grid>
         


          <Modal
            open={this.state.modalOpen}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >

            <Box className="treeSelectCenter">
              <Stack direction="column" spacing={2} alignItems="right" justifyContent="center">
                <TextField label="Tree Name" variant="outlined" size="small" onChange={this.handleTreeNameChanged} defaultValue={this.getTreeName()} />
                <ConfigPicker projectId={projectId}></ConfigPicker>
                {modelDropdown}

              </Stack>
            </Box>

          </Modal>
        </AppBar>
        <Stack direction="row">
          <Paper variant="riskypane">
            <SubTreePane rootTreeId={treeId} projectId={projectId} />
          </Paper>
          {<TreeViewer onNodeClicked={this.onNodeClicked} treeMap={this.state.treeMap} />}

          {rightPane}
          

        </Stack>
      </>
    )
  }
}

export default TreeViewPage;
