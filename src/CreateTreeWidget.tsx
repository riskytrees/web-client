import React from 'react';


class CreateTreeWidget extends React.Component<{
  projectId: string;
}> {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  async createTree() {
    const treeNameField = document.getElementById("treeNameField");
    if (treeNameField) {
      const title = (treeNameField as HTMLInputElement).value;
      const projectId = this.props['projectId'];
  
      console.log("Create Tree")
      let response = await fetch("http://localhost:8000/projects/" + projectId + '/trees', {
        method: 'POST',
        body: JSON.stringify({
          title
        })
      });
      const data = await response.json();
  
      window.location.reload();
    }

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

export default CreateTreeWidget;
