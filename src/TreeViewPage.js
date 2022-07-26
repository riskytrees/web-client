import React from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {Stack} from "@mui/material";

import TreeViewer from './TreeViewer';
import NodePane from './NodePane';

class TreeViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { treeData: {}, selectedNode: null, modalOpen: false };
    this.onNodeClicked = this.onNodeClicked.bind(this);
    this.onNodeChanged = this.onNodeChanged.bind(this);
    this.onAddOrDeleteNode = this.onAddOrDeleteNode.bind(this);
    this.localTreeNodeUpdate = this.localTreeNodeUpdate.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.loadTree()

  }

  async loadTree() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let response = await fetch("http://localhost:8000/projects/" + projectId + "/trees/" + treeId);
    let data = await response.json();
    this.setState({
      treeData: data.result
    })
  }

  async updateTree() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let response = await fetch("http://localhost:8000/projects/" + projectId + "/trees/" + treeId, {
      method: 'PUT',

      body: JSON.stringify(this.state.treeData)
    });

  }

  localTreeNodeUpdate(newNodeData) {
    for (const [idx, node] of this.state.treeData.nodes.entries()) {
      if (node.id === newNodeData.id) {
        const treeData = JSON.parse(JSON.stringify(this.state.treeData));
        treeData.nodes[idx]['title'] = newNodeData['title'];
        treeData.nodes[idx]['description'] = newNodeData['description'];
        treeData.nodes[idx]['modelAttributes'] = newNodeData['modelAttributes'];

        console.log("Tree Update")
        console.log(treeData)
        this.setState({
          treeData: treeData,
          selectedNode: this.state.selectedNode
        }, this.updateTree);
      }
    }
  }

  onNodeClicked(data) {
    console.log(data)
    this.setState({
      treeData: this.state.treeData,
      selectedNode: data
    });
  }

  onNodeChanged(data) {
    this.localTreeNodeUpdate(data)
  }

  onAddOrDeleteNode(parentNodeId, isAddAction) {
    const treeData = JSON.parse(JSON.stringify(this.state.treeData));
    let uuid = crypto.randomUUID();

    if (isAddAction) {
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
          nodeToDelete = idx;
        }
      }

      if (isAddAction === false && node.children.includes(parentNodeId)) {
        treeData.nodes[idx]['children'] = treeData.nodes[idx]['children'].filter(item => item !== parentNodeId);
      }
    }

    if (nodeToDelete !== null) {
      treeData.nodes.splice(nodeToDelete, 1);
    }

    this.setState({
      treeData: treeData,
      selectedNode: this.state.selectedNode
    }, this.updateTree);
  }

  handleOpen() {
   this.setState({modalOpen: true})
  }

  handleClose() {
    this.setState({modalOpen: false})
  }

  render() {

    return (
      <>
        <div class='RiskyNavBar'>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button onClick={this.handleOpen} variant="text">TODO</Button>
          </Box>

          <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
          <Box>
          <TextField label="Tree Name" variant="filled" />
          <Select
            labelId="config-dropdown-label"
            id="config-dropdown"
            value={null}
            label="Config"
            onChange={null}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>

          <Select
            labelId="model-dropdown-label"
            id="model-dropdown"
            value={null}
            label="Config"
            onChange={null}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          </Box>
        </Modal>

        </div>

          <Stack container spacing={2} direction="row">
            <div class='RiskyPane'>
            Tree Viewer Pane
            </div>
            {this.state.treeData && this.state.treeData.nodes && <TreeViewer id="tree_viewer" onNodeClicked={this.onNodeClicked} treeData={this.state.treeData} /> }
            <div class='RiskyPane'>
              <NodePane triggerAddDeleteNode={this.onAddOrDeleteNode} onNodeChanged={this.onNodeChanged} currentNode={this.state.selectedNode}>
              </NodePane>
            </div>
          </Stack>
      </>
    )
  }
}

export default TreeViewPage;
