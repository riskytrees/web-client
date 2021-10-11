
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
     const visNodes = new vis.DataSet(nodes);

     // create an array with edges
     var visEdges = new vis.DataSet(edges);

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
     var network = new vis.Network(container, data, options);

  }

  render() {
    return (
      <>

        <div id="mynetwork"></div>

      </>
    )
  }
}


class TreeViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { treeData: {} };

    this.loadTree()
  }

  async loadTree() {
    const projectId = this.props.projectId;
    const treeId = this.props.treeId;

    let response = await fetch("http://localhost:8000/projects/" + this.props.projectId + "/trees/" + this.props.treeId);
    let data = await response.json();
    this.setState({
      treeData: data.result
    })
  }

  render() {
    return (
      <>
        <div>{JSON.stringify(this.state.treeData)}</div>
        {this.state.treeData.nodes && <TreeViewer id="tree_viewer" treeData={JSON.stringify(this.state.treeData)} /> }
      </>
    )
  }
}

const domContainer = document.querySelector('#rt_tree_view_page');
ReactDOM.render(<TreeViewPage treeId={domContainer.getAttribute("treeId")} projectId={domContainer.getAttribute("projectId")} />, domContainer);
