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
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Switch, Typography } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TreeViewer from './TreeViewer';
import NodePane from './NodePane';
import TreeData from './interfaces/TreeData';
import { RiskyRisk } from './Risk';
import FormControl from "@mui/material/FormControl";
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InputLabel from "@mui/material/InputLabel";
import SubTreePane from './SubTreePane';
import ConfigPicker from './ConfigPicker';
import { RiskyApi } from './api';
import Item from '@mui/material/Grid';
import AnalysisPane from './AnalysisPane';
import LogoMark from './img/logomark.svg';
import AccountTree from '@mui/icons-material/AccountTree';
import { saveAs } from 'file-saver';
import { ArrowBack, ArrowForward, BackHand, Search, Share } from '@mui/icons-material';
import { TreeSearch } from './TreeSearch';
import { v4 as uuidv4 } from 'uuid';

class TreeViewPage extends React.Component<{

}, {
  treeMap: Record<string, TreeData>;
  selectedNode: {
    id: string;
    label: string;
  } | null;
  modalOpen: boolean;
  shareModalOpen: boolean;
  paneOpen: boolean;
  actionModalOpen: boolean;
  searchModalOpen: boolean;
  models: any[];
  selectedModel: string;
  analysisModeEnabled: boolean;
  zoomLevel: number;
  isPublic: boolean | null;
  searchQuery: string;
  searchIndex: number;
  confirmDeleteOpen: boolean;
  copiedData: Record<string, any>;
  collapsedDownNodeIds: string[];
}> {
  riskEngine: RiskyRisk;
  searchEngine: TreeSearch;

  constructor(props) {
    super(props);
    this.state = { treeMap: {}, selectedNode: null, isPublic: null, modalOpen: false, shareModalOpen: false, searchModalOpen: false, actionModalOpen: false, models: [], selectedModel: "", analysisModeEnabled: false, zoomLevel: 1.0, paneOpen: false, searchQuery: '', searchIndex: 0, confirmDeleteOpen: false, copiedData: {}, collapsedDownNodeIds: [] };

    this.onNodeClicked = this.onNodeClicked.bind(this);
    this.onNodeChanged = this.onNodeChanged.bind(this);
    this.onAddOrDeleteNode = this.onAddOrDeleteNode.bind(this);
    this.onCopyOrPasteNode = this.onCopyOrPasteNode.bind(this);
    this.localTreeNodeUpdate = this.localTreeNodeUpdate.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSubtreeClicked = this.handleSubtreeClicked.bind(this);
    this.handleActionPanelOpen = this.handleActionPanelOpen.bind(this);
    this.handleSearchOpen = this.handleSearchOpen.bind(this);
    this.handleSearchClose = this.handleSearchClose.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleActionPanelClose = this.handleActionPanelClose.bind(this);
    this.modelDropdownChanged = this.modelDropdownChanged.bind(this);
    this.handleTreeNameChanged = this.handleTreeNameChanged.bind(this);
    this.handleAnalysisClicked = this.handleAnalysisClicked.bind(this);
    this.goBackToProjects = this.goBackToProjects.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.loadTree = this.loadTree.bind(this);
    this.handleZoomChange = this.handleZoomChange.bind(this);
    this.exportTree = this.exportTree.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleShareClose = this.handleShareClose.bind(this);
    this.handlePublicityChange = this.handlePublicityChange.bind(this);
    this.handleSearchValueChanged = this.handleSearchValueChanged.bind(this);
    this.handleSearchBack = this.handleSearchBack.bind(this);
    this.handleSearchForward = this.handleSearchForward.bind(this);
    this.handleStartDeleteTree = this.handleStartDeleteTree.bind(this);
    this.pastePartialTree = this.pastePartialTree.bind(this);
    this.onNodeFoldToggle = this.onNodeFoldToggle.bind(this);

    this.riskEngine = new RiskyRisk(this.state.treeMap, null);
    this.searchEngine = new TreeSearch(this.state.treeMap, null);
  }

  componentDidMount() {
    this.loadTree()
    this.loadPublicity()
    this.getListOfModels();
    this.getCurrentModel();

    setInterval(this.loadTree, 10000)
  }

  exportTree() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const treeId = urlParams.get('id');

    let blob = new Blob([JSON.stringify(this.state.treeMap[treeId])], { type: "text/json" });

    saveAs(blob, this.getTreeName() + ".json")
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

  handleZoomChange(event) {
    let desiredLevel = event.target.value;

    this.setState({
      zoomLevel: desiredLevel
    })
  }

  async handleStartDeleteTree() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const treeId = urlParams.get('id');
    const projectId = urlParams.get('projectId');

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees/" + treeId, {
      method: 'DELETE'
    });

    if (data.ok) {
      this.goBackToProjects();
    }
  }

  async handlePublicityChange(event) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const treeId = urlParams.get('id');
    const projectId = urlParams.get('projectId');


    let newState = event.target.checked;

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees/" + treeId + "/public", {
      method: 'PUT',
      body: JSON.stringify({
        isPublic: newState
      })
    });

    if (data.ok) {
      await this.loadPublicity()
    }

  }

  onNodeFoldToggle() {
    const nodeIds = this.state.collapsedDownNodeIds;
    if (nodeIds.includes(this.state.selectedNode.id)) {
      this.setState({
        collapsedDownNodeIds: nodeIds.filter((item) => {
          return item !== this.state.selectedNode.id
        })
      })
    } else {
      nodeIds.push(this.state.selectedNode.id)
      this.setState({
        collapsedDownNodeIds: nodeIds
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
        this.searchEngine = new TreeSearch(this.state.treeMap, treeId);
      })
    }
  }

  async loadPublicity() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees/" + treeId + '/public', {});

    if (data.ok) {
      this.setState({
        isPublic: data['result']['isPublic']
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
    this.searchEngine = new TreeSearch(this.state.treeMap, treeId);

    let response = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees/" + treeIdToUpdate, {
      method: 'PUT',
      body: JSON.stringify(this.state.treeMap[treeIdToUpdate])
    })

    if (reloadAll) {
      await this.loadTree();
    }

  }

  localTreeNodeUpdate(treeIdToUpdate: string, newNodeData) {
    for (const [idx, node] of this.state.treeMap[treeIdToUpdate].nodes.entries()) {
      if (node.id === newNodeData.id) {
        const treeData = JSON.parse(JSON.stringify(this.state.treeMap[treeIdToUpdate]));
        treeData.nodes[idx]['title'] = newNodeData['title'];
        treeData.nodes[idx]['description'] = newNodeData['description'];
        treeData.nodes[idx]['modelAttributes'] = newNodeData['modelAttributes'];
        treeData.nodes[idx]['conditionAttribute'] = newNodeData['conditionAttribute'];
        const treeMap = { ...this.state.treeMap };
        treeMap[treeIdToUpdate] = treeData;
        this.setState({
          treeMap: treeMap,
          selectedNode: this.state.selectedNode
        }, () => this.updateTree(treeIdToUpdate));
      }
    }
  }

  onNodeClicked(data, parentData) {
    this.setState({
      selectedNode: data
    });
  }

  onNodeChanged(treeIdToUpdate: string, data) {
    this.localTreeNodeUpdate(treeIdToUpdate, data)
  }

  async copyRepresentation(treeId: string, nodeId: string) {
    const treeData = JSON.parse(JSON.stringify(this.state.treeMap[treeId]));
    let result = {}

    for (const node of treeData.nodes) {
      if (node.id === nodeId) {
        result = {...node}
        result['children'] = []

        for (const childId of node.children) {
          const subNodeTreeId = await this.getTreeIdFromNodeId(childId);
          if (subNodeTreeId === treeId) {
            result['children'].push(await this.copyRepresentation(treeId, childId))
          } else {
            result['children'].push(childId)
          }
        }

        result['id'] = uuidv4();

      }
    }

    return result;
  }

  async pastePartialTree(treeId: string, nodeId: string) {
    if (this.state.copiedData && this.state.copiedData['id']) {
      const treeData = JSON.parse(JSON.stringify(this.state.treeMap[treeId]));

      let nodesToAdd = [this.state.copiedData];
  
      while (nodesToAdd.length > 0) {
        const node = nodesToAdd.pop();
        let properChildren = [];
  
        for (const child of node.children) {
          if (typeof child === "string") {
            properChildren.push(child)
          } else {
            nodesToAdd.push(child);
            properChildren.push(child.id)
          }
        }

        node['children'] = properChildren;
        treeData.nodes.push(node)
      }

      for (const [idx, node] of treeData.nodes.entries()) {
        if (node.id === nodeId) {
          treeData.nodes[idx]['children'].push(this.state.copiedData['id'])
        }
      }
  
      const treeMap = structuredClone(this.state.treeMap);
      treeMap[treeId] = treeData;
  
      this.setState({
        treeMap: treeMap,
        selectedNode: this.state.selectedNode
      }, () => this.updateTree(treeId, true));
    }
  }

  async onCopyOrPasteNode(isCopy: boolean) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const primaryTreeId = urlParams.get('id');

    if (this.state.selectedNode) {
      const treeId = await this.getTreeIdFromNodeId(this.state.selectedNode.id);
      if (treeId === primaryTreeId) {
        if (isCopy) {
          this.setState({
            "copiedData": await this.copyRepresentation(treeId, this.state.selectedNode.id)
          })
        } else {
          await this.pastePartialTree(treeId, this.state.selectedNode.id);
        }

      }
    }
  }

  async handleSearchBack() {
    const results = this.searchEngine.search(this.state.searchQuery);

    if (results.length > 0) {
      let newIdx = 0;
      if (this.state.searchIndex === 0) {
        // Wrap
        newIdx = results.length - 1;
      } else {
        newIdx = this.state.searchIndex - 1;
      }

      this.setState({
        searchIndex: newIdx
      }, async () => {
        const treeId = await this.getTreeIdFromNodeId(results[this.state.searchIndex]);
        const node = this.getRawNodeFromTree(results[this.state.searchIndex], treeId);

        if (node) {
          this.onNodeClicked(node, null);
        }
      })
    }
  }

  async handleSearchForward() {
    const results = this.searchEngine.search(this.state.searchQuery);

    if (results.length > 0) {
      let newIdx = 0;

      if (this.state.searchIndex === results.length - 1) {
        // Wrap
        newIdx = 0;
      } else {
        newIdx += 1;
      }

      this.setState({
        searchIndex: newIdx
      }, async () => {
        const treeId = await this.getTreeIdFromNodeId(results[this.state.searchIndex]);
        const node = this.getRawNodeFromTree(results[this.state.searchIndex], treeId);

        if (node) {
          this.onNodeClicked(node, null);
        }
      })
    }
  }

  async getTreeIdFromNodeId(nodeId: string) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/nodes/" + nodeId, {});
    return data['result']['treeId'];
  }

  async getNodeIdsOnPathToNode(nodeId: string, lookingAtId?: string, lookingAtTreeId?: string) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let resultNodes = new Set();

    if (!lookingAtId && treeId) {
      lookingAtId = this.state.treeMap[treeId].rootNodeId;
    }

    if (!lookingAtTreeId && treeId) {
      lookingAtTreeId = treeId;
    }

    if (lookingAtTreeId && lookingAtId) {
      let currentNode: Record<string, any> | null = null;
      for (const treeNode of this.state.treeMap[lookingAtTreeId].nodes) {
        if (treeNode.id === lookingAtId) {
          currentNode = treeNode;
        }
      }

      if (currentNode) {
        if (currentNode.id === nodeId) {
          return new Set([currentNode.id])
        }


        for (const child of currentNode.children) {
          const subNodeIds = await this.getNodeIdsOnPathToNode(nodeId, child, await this.getTreeIdFromNodeId(nodeId));

          if (subNodeIds.size > 0) {
            // I must be part of the path too
            resultNodes.add(currentNode.id)
          }

          for (const nodeId in subNodeIds) {
            resultNodes.add(nodeId)

          }
        }
      }
    }

    return resultNodes;

  }

  async validateSubtreeAddition(subtreeNodeId: string, nodeId: string) {
    // Reject if subtreeNodeId is on the path to nodeId
    const nodeIds = await this.getNodeIdsOnPathToNode(nodeId);

    if (nodeIds.has(subtreeNodeId)) {
      return false;
    }

    return true;

  }

  async onAddOrDeleteNode(treeIdToUpdate: string, parentNodeId, isAddAction, subtreeNodeId: string | null = null) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const treeId = urlParams.get('id');


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
            if (await this.validateSubtreeAddition(subtreeNodeId, node.id)) {
              treeData.nodes[idx]['children'].push(subtreeNodeId);
            }
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

      if (nodeToDelete !== null && nodeToDelete !== null) {
        for (const [idx, node] of treeData.nodes.entries()) {
          if (node.children.includes(parentNodeId)) {
            treeData.nodes[idx]['children'] = treeData.nodes[idx]['children'].filter(item => item !== parentNodeId);
          }
        }

        treeData.nodes.splice(nodeToDelete, 1);
      } else if (!isAddAction) {
        // Right this second you can only have one copy of a subtree so simply find all the nodes that reference the subtree:
        for (const [idx, node] of treeData.nodes.entries()) {
          if (node.children.includes(parentNodeId)) {
            treeData.nodes[idx]['children'] = treeData.nodes[idx]['children'].filter(item => item !== parentNodeId);
          }
        }
      }

      const treeMap = structuredClone(this.state.treeMap);
      treeMap[treeIdToUpdate] = treeData;

      this.setState({
        treeMap: treeMap,
        selectedNode: this.state.selectedNode
      }, () => this.updateTree(treeIdToUpdate, subtreeNodeId !== null));

    } else {
    }
  }

  async handleUndo() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees/" + treeId + "/undo", {
      method: 'PUT'
    });

    if (data.ok) {
      await this.loadTree()
    }

  }

  handleOpen() {
    this.setState({ modalOpen: true })
  }

  handleShare() {
    this.setState({
      shareModalOpen: true
    })
  }

  handleShareClose() {
    this.setState({
      shareModalOpen: false
    })
  }

  handleActionPanelOpen() {
    this.setState({ actionModalOpen: true })
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }

  handleActionPanelClose() {
    this.setState({ actionModalOpen: false })
  }

  handleSearchOpen() {
    this.setState({ searchModalOpen: true })
  }

  handleSearchClose() {
    this.setState({ searchModalOpen: false })
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

  async handleSearchValueChanged(event) {
    const proposedVal = event.target.value;

    this.setState({
      searchQuery: proposedVal
    });

    const results = this.searchEngine.search(this.state.searchQuery);

    if (results.length > 0) {
      const treeId = await this.getTreeIdFromNodeId(results[this.state.searchIndex]);
      const node = this.getRawNodeFromTree(results[this.state.searchIndex], treeId);

      if (node) {
        this.onNodeClicked(node, null);
      }
    }
  }

  // Returns a version of the node as if it was passed by TreeViewer.
  // This is NOT what is stored in the TreeMap
  getRawNodeFromTree(nodeId: string, treeId: string) {
    for (const node of this.state.treeMap[treeId].nodes) {
      if (node.id === nodeId) {
        return {
          id: node.id,
          label: node.title,
          description: node.description,
          modelAttributes: node.modelAttributes,
          conditionAttribute: node.conditionAttribute,
        };
      }
    }

    return null;
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

  handleSubtreeClicked(event) {
    if (this.state.paneOpen) {
      this.setState({
        paneOpen: false
      });
    } else {
      this.setState({
        paneOpen: true
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
      modelDropdown = <FormControl size="small">
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

      rightPane = <AnalysisPane rootNodeId={this.state.treeMap[treeId].rootNodeId} riskEngine={this.riskEngine} selectedModel={this.state.selectedModel}></AnalysisPane>
    }

    let customZoomEntry = null;

    if (![0.5, 0.75, 1.0, 2.0].includes(this.state.zoomLevel)) {

      customZoomEntry = <MenuItem value={this.state.zoomLevel}>{Number(this.state.zoomLevel.toFixed(2)) * 100}%</MenuItem>
    }

    let leftpane = null;
    if (this.state.paneOpen) {
      leftpane =
        <Paper variant="leftriskypane">
          <SubTreePane rootTreeId={treeId} projectId={projectId} />
        </Paper>
    }


    return (
      <>
        <Dialog
          open={this.state.confirmDeleteOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this tree?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will delete the current tree with no way to recover it.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.setState({ confirmDeleteOpen: false })
            }}>No, I want to keep this tree.</Button>
            <Button onClick={this.handleStartDeleteTree} autoFocus>
              Yes, Delete it.
            </Button>
          </DialogActions>
        </Dialog>

        <AppBar>
          <Grid container>
            <Grid item xs={5} marginTop="5.75px">
              <Stack spacing={2} direction="row">
                <Box></Box>

                <Button aria-describedby="actionButton" onClick={this.handleActionPanelOpen} variant='inlineNavButton' endIcon={<ArrowDropDownIcon />}><img src={LogoMark} width="25px"></img>Menu</Button>
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
                        <ListItemButton>
                          <ListItemText primary="Export Text Tree" onClick={this.exportTree} />
                        </ListItemButton>
                      </ListItem>

                      <ListItem>
                        <ListItemButton disabled={true}>
                          <ListItemText primary="Export Analysis" />
                        </ListItemButton>
                      </ListItem>

                      <Divider light />

                      <ListItem>
                        <ListItemButton>
                          <ListItemText primary="Undo" onClick={this.handleUndo} />
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

                      <ListItem>
                        <ListItemButton onClick={() => {
                          this.setState({ confirmDeleteOpen: true })
                        }}>
                          <ListItemText primary="Delete Tree" />
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

            <Grid item xs={2} marginTop="5.75px" sx={{ maxWidth: "220px" }}>
              <Stack alignContent="center" sx={{ maxWidth: "220px" }}>
                <Button variant='inlineNavButton' onClick={this.handleOpen} endIcon={<ArrowDropDownIcon />}>{this.getTreeName()}</Button>
              </Stack>
            </Grid>
            <Grid item xs={5}  marginTop="10px">

            <Stack spacing={2} direction="row" justifyContent="flex-end" >

            <Button aria-describedby="searchButton" onClick={this.handleSearchOpen}>Search</Button>
              <Popover id="searchButton"
                  open={this.state.searchModalOpen}
                  onClose={this.handleSearchClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',}}>

              <Stack spacing={2} direction="row" justifyContent="flex-end" >
                <TextField size='small' placeholder='Search' value={this.state.searchQuery} onChange={this.handleSearchValueChanged}
                  sx={{ overflow: 'hide', }}></TextField>
                <IconButton onClick={this.handleSearchBack}>
                  <ArrowBack></ArrowBack>
                </IconButton>
                <IconButton onClick={this.handleSearchForward}>
                  <ArrowForward></ArrowForward>
                </IconButton>
  
                </Stack>
                </Popover>


                <IconButton onClick={this.handleShare} >
                  <Share></Share>
                </IconButton>
                <FormControl size="small">
                  <Select
                    id="zoom-select"
                    value={this.state.zoomLevel}
                    onChange={this.handleZoomChange}
                  >

                    <MenuItem value={0.50}>50%</MenuItem>
                    <MenuItem value={0.75}>75%</MenuItem>
                    <MenuItem value={1.0}>100%</MenuItem>
                    <MenuItem value={2.0}>200%</MenuItem>

                    {customZoomEntry}

                  </Select>
                </FormControl>
                <Button variant="primaryButton" onClick={this.handleAnalysisClicked} startIcon={<AnalyticsIcon> </AnalyticsIcon>} sx={{ display: 'flex', overflow: 'none', flex: 'none', }}> {this.state.analysisModeEnabled ? "Close Analysis" : "Show Analysis"} </Button>
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

          <Modal
            open={this.state.shareModalOpen}
            onClose={this.handleShareClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="treeSelectCenter">
              <Stack>
                <FormGroup>
                  <FormControlLabel control={<Switch onChange={this.handlePublicityChange} checked={this.state.isPublic} />} label="Is Public" />
                </FormGroup>

              </Stack>
            </Box>

          </Modal>

          <Button variant={this.state.paneOpen ? "subtreeButtonActive" : "subtreeButton"} onClick={this.handleSubtreeClicked}><AccountTree sx={{ fontSize: 20, }}></AccountTree></Button>
        </AppBar>
        {leftpane}

        {rightPane}

        {<TreeViewer collapsedDownNodeIds={structuredClone(this.state.collapsedDownNodeIds)} onNodeFoldToggle={this.onNodeFoldToggle} selectedNode={this.state.selectedNode} onCopyOrPasteNode={this.onCopyOrPasteNode} onAddOrDeleteNode={this.onAddOrDeleteNode} onZoomChanged={this.handleZoomChange} onNodeClicked={this.onNodeClicked} treeMap={this.state.treeMap} zoomLevel={this.state.zoomLevel} riskEngine={this.state.analysisModeEnabled ? this.riskEngine : null} selectedModel={this.state.selectedModel} />}

      </>
    )
  }
}

export default TreeViewPage;
