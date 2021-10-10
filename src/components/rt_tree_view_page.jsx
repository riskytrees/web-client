
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
      treeData: data
    })
  }

  render() {
    return (
        <div>{JSON.stringify(this.state.treeData)}</div>
    )
  }
}

const domContainer = document.querySelector('#rt_tree_view_page');
ReactDOM.render(<TreeViewPage treeId={domContainer.getAttribute("treeId")} projectId={domContainer.getAttribute("projectId")} />, domContainer);
