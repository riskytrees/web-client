import React from 'react';
import {ListItemIcon} from "@mui/material"
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TreeData from './interfaces/TreeData';


class TreeViewPane extends React.Component<{
  treeMap: Record<string, TreeData>;
}, {
  treeMap: Record<string, TreeData>;
}> {
  constructor(props) {
    super(props);
    this.state = { treeMap: this.props.treeMap };

    this.lineItemClicked = this.lineItemClicked.bind(this);
    this.generateLineItem = this.generateLineItem.bind(this);
    this.renderTreeList = this.renderTreeList.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if (this.props.treeMap) {
        this.setState({
          treeMap: this.props.treeMap
        });
      }
    }
  }

  findNodeWithId(nodeId) {
    for (const tree of Object.values(this.state.treeMap)) {
      for (const node of tree.nodes) {
        if (node.id === nodeId) {
            return node;
        }
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
    const toReturn: JSX.Element[] = [];
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
                            if (node) {
                              return this.generateLineItem(node, level + 1)
                            }
                        })
                    }
                </List>
            </Collapse>
        )

    }

    return toReturn;
  }

  renderTreeList() {
    if (this.state.treeMap) {
        console.log("Render Tree List")
        const toReturn = [];
        console.log(this.state.treeMap)
    
        // Find the root node
        const children: string[] = [];
        let rootNode = null;
    
        for (const tree of Object.values(this.state.treeMap)) {
          for (const node of tree.nodes) {
            for (const child of node.children) {
                children.push(child);
            }
          }
        }

        for (const tree of Object.values(this.state.treeMap)) {

          for (const node of tree.nodes) {
            if (node) { // Node can be null if it no longer exists
              if (!children.includes(node.id)) {
                rootNode = node;
                break;
            }
            }

          }
        }
    
    
        if (rootNode) {
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
