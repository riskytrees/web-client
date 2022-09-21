import React from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {ListItemIcon, Stack} from "@mui/material"
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import TreeViewer from './TreeViewer';
import NodePane from './NodePane';

class TreeViewPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nodes: [] };

    this.lineItemClicked = this.lineItemClicked.bind(this);
    this.generateLineItem = this.generateLineItem.bind(this);
    this.renderTreeList = this.renderTreeList.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if (this.props.nodes) {
        this.setState({
          nodes: this.props.nodes
        });
      }
    }
  }

  findNodeWithId(nodeId) {
    for (const node of this.state.nodes) {
        if (node.id === nodeId) {
            return node;
        }
    }

    return null;
  }

  lineItemClicked(lineItemId) {
    console.log(lineItemId)

    const stateChangeObj = {};

    if (this.state[lineItemId]) {
        stateChangeObj[lineItemId] = false;
    } else {
        stateChangeObj[lineItemId] = true;
    }


    this.setState(stateChangeObj, () => {
        console.log("State:")
        console.log(this.state)
    })
  }

  generateLineItem(node, level) {
    const toReturn = [];
    const key = "line-" + node.id;

    const indentClass = 'RiskyIndentLevel' + level.toString()

    toReturn.push(<ListItemButton sx={{ ml: (level * 10).toString() + 'px' }} alignItems="flex-start" id={key} key={key} onClick={() => {
        this.lineItemClicked(key)
    }}>
        <ListItemIcon></ListItemIcon>
        <ListItemText primary={node.title}/>
        {this.state[key] ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>)

   if (node.children.length > 0) {
        toReturn.push(<Collapse in={this.state[key]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        node.children.map(child => {
                            const node = this.findNodeWithId(child);
                            return this.generateLineItem(node, level + 1)
                        })
                    }
                </List>
            </Collapse>
        )

    }

    return toReturn;
  }

  renderTreeList() {
    if (this.state.nodes) {
        console.log("Render Tree List")
        const toReturn = [];
        console.log(this.state.nodes)
    
        // Find the root node
        const children = [];
        let rootNode = null;
    
        for (const node of this.state.nodes) {
            for (const child of node.children) {
                children.push(child);
            }
        }
    
        for (const node of this.state.nodes) {
            if (!children.includes(node.id)) {
                rootNode = node;
                break;
            }
        }
    
    
        if (rootNode) {
            console.log("Found root")
    
        
            return this.generateLineItem(rootNode, 0)
        }
    }

    return null;
  }

  render() {

    return (
      <>
        <List
            sx={{ width: '100%', maxWidth: 360 }}
            aria-labelledby="nested-list-subheader"
            disablePadding
            subheader={
                <ListSubheader id="nested-list-subheader">
                    Tree Viewer
                </ListSubheader>
            }
        >

        <div>{this.renderTreeList()}</div>

        </List>
      </>
    )
  }
}

export default TreeViewPane;
