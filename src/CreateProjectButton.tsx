import React from 'react';

class CreateProjectButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  async createProject() {
    const createProjectButtonField = document.getElementById("createProjectButtonField") as HTMLInputElement;
    if (createProjectButtonField) {
      const title = createProjectButtonField.value;

      let response = await fetch("http://localhost:8000/projects", {
        method: 'POST',
        body: JSON.stringify({
          title
        })
      });
      let data = await response.json();
  
      window.location.reload()
    }
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

export default CreateProjectButton;
