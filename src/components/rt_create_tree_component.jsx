
class CreateTreeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  async createTree() {
    const title = document.getElementById("treeNameField").value;
    const projectId = this.props.projectId;

    console.log("Create Tree")
    let response = await fetch("http://localhost:8000/projects/" + projectId + '/trees', {
      method: 'POST',
      body: JSON.stringify({
        title
      })
    });
    let data = await response.json();

    location.reload()
  }

  render() {
    return (
      <>
        <input placeholder="Tree Name" id="treeNameField">
        </input>
        <button onClick={this.createTree.bind(this)}>
          Create New Tree
        </button>
      </>
    )
  }
}

const createButtonContainer = document.querySelector('#rt_create_tree_component');
ReactDOM.render(<CreateTreeWidget projectId={domContainer.getAttribute("projectId")} />, createButtonContainer);
