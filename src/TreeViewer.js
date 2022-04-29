import React from 'react';
import { Network } from "vis-network/peer";
import { DataSet } from "vis-data/peer";


class TreeViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.treeData };

    this.loadAndRender = this.loadAndRender.bind(this);

  }

  loadAndRender() {
    console.log("render")
    const nodes = [];
    const edges = [];

    for (const node of this.state.data.nodes) {
      nodes.push({
        id: node.id,
        label: node.title,
        description: node.description
      })

      for (const child of node.children) {
        edges.push({
          from: node.id,
          to: child
        })
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
    let network = new Network(container, data, options);
    network.on('click', (properties) => {
       var id = properties.nodes[0];
       let selectedNodes = [];
       for (const node of nodes) {
         if (node.id === id) {
           this.nodeClicked(node);
         }
       }
    });

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
      if (this.props.treeData) {
        this.setState ({ data: this.props.treeData }, this.loadAndRender);
      }
    }
  }

  render() {
    return (
      <>

        <div id="mynetwork" class='RiskyTree'></div>

      </>
    )
  }
}

export default TreeViewer;
