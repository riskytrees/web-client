import React from 'react';
import { Network } from "vis-network/peer";
import { DataSet } from "vis-data/peer";
import Container, { ContainerProps } from "@mui/material/Container";
import Paper from '@mui/material/Paper';
import TreeData from './interfaces/TreeData';


class TreeViewer extends React.Component<{
  treeMap: Record<string, TreeData>

  onNodeClicked: Function;
}, {
  treeMap: Record<string, TreeData>
}> {
  constructor(props) {
    super(props);
    this.state = { treeMap: this.props.treeMap };

    this.loadAndRender = this.loadAndRender.bind(this);

  }

  getShapeForNodeType(nodeModelAttributes) {

    if (nodeModelAttributes && nodeModelAttributes['node_type'] && nodeModelAttributes['node_type']['value_string']) {
      if (nodeModelAttributes['node_type']['value_string'] === 'and') {
        return 'triangle';
      } else if (nodeModelAttributes['node_type']['value_string'] === 'or') {
        return 'triangleDown';
      }
    }
    return 'square';
  }

  loadAndRender() {
    const nodes: Record<string, any>[] = [];
    const edges: Record<string, any>[] = [];

    for (const tree of Object.values(this.state.treeMap)) {
      for (const node of tree.nodes) {
        nodes.push({
          id: node.id,
          label: node.title,
          description: node.description,
          modelAttributes: node.modelAttributes,
          conditionAttribute: node.conditionAttribute,
          size: 15,
          shape: this.getShapeForNodeType(node.modelAttributes)
        })
  
        for (const child of node.children) {
          edges.push({
            from: node.id,
            to: child
          })
        }
      }
    }

    // create an array with nodes
    const visNodes = new DataSet(nodes);

     // create an array with edges
     var visEdges = new DataSet(edges);

     // create a network
     var container = document.getElementById("mynetwork");
     var data = {
       nodes: visNodes,
       edges: visEdges,
     };
     const options = {
      layout: {
        hierarchical: {
          direction: 'UD',
          sortMethod: 'directed',
          nodeSpacing: 150,
          levelSeparation: 100
        }
      },
      interaction: { dragNodes: false },
      physics: {
        enabled: false
      }
    }

    if (container) {
      let network = new Network(container, data, options);
      network.on('click', (properties) => {
         var id = properties.nodes[0];
         let selectedNodes = [];
         let foundNode = false;
         for (const node of nodes) {
           if (node.id === id) {
             this.nodeClicked(node);
             foundNode = true;
           }
         }

         if (!foundNode) {
          this.nodeClicked(null);
         }
      });
    }
  }

  componentDidMount() {
    this.loadAndRender()
  }

  nodeClicked(node) {
    if (this.props.onNodeClicked) {
      this.props.onNodeClicked(node);
    }
  }

  componentDidUpdate(prevProps) {
    console.log(JSON.stringify(prevProps))

    console.log(JSON.stringify(this.props))

    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      console.log("test")
      if (this.props.treeMap) {
        this.setState ({ treeMap: this.props.treeMap }, this.loadAndRender);
      }
    }
  }

  render() {
    return (
      <>

        {/*<div id="mynetwor" className='RiskyTree'></div> */}
        <Paper variant="treearea" id="mynetwork"></Paper>
      </>
    )
  }
}

export default TreeViewer;
