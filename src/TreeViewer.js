import React from 'react';
import { Network } from "vis-network/peer";
import { DataSet } from "vis-data/peer";


class TreeViewer extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.treeData)
    this.state = { data: JSON.parse(this.props.treeData) };

  }

  componentDidMount() {
    const nodes = [];
    const edges = [];

    for (const node of this.state.data.nodes) {
      nodes.push({
        id: node.id,
        label: node.title
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
     var network = new Network(container, data, options);

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
