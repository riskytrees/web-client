
class TreesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { trees: [] };
    this.loadTrees();
  }

  async loadTrees() {
    this.state = { trees: [] };

    let response = await fetch("http://localhost:8000/projects/" + this.props.projectId + "/trees");
    let data = await response.json();

    if (data['result']['trees']) {
      for (const tree of data['result']['trees']) {
        this.setState({
          trees: this.state.trees.concat(tree)
        })
      }
    }
  }

  render() {

    const trees = this.state.trees;
    const rows = [];

    for (const tree of trees) {
      const path = "/tree?id=" + tree.id;
      rows.push(<tr key={tree.id}><td><a href={path}>{tree.title}</a></td></tr>)

    }

    return (
      <table>
        <tbody>
        {rows}

        </tbody>
      </table>
    )
  }
}

const domContainer = document.querySelector('#rt_trees_list_component');
ReactDOM.render(<TreesList projectId={domContainer.getAttribute("projectId")} />, domContainer);
