
class CreateProjectButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  async createProject() {
    const title = document.getElementById("createProjectButtonField").value;

    console.log("Create Project")
    let response = await fetch("http://localhost:8000/projects", {
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
        <input placeholder="Project Name" id="createProjectButtonField">
        </input>
        <button onClick={this.createProject}>
          Create New Project
        </button>
      </>
    )
  }
}

const createButtonContainer = document.querySelector('#rt_create_project_button_component');
ReactDOM.render(<CreateProjectButton />, createButtonContainer);
