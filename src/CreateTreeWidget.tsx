import React from 'react';
import { v4 as uuidv4 } from 'uuid';


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

      console.log(data)

      const newRootNodeId = uuidv4();
      data['result']['nodes'] = [
        {
          title: "New Root node",
          description: "This is the root node",
          modelAttributes: {},
          conditionAttribute: "",
          id: newRootNodeId,
          children: []
        }
      ]

      data['result']['rootNodeId'] = newRootNodeId;

      let addNodeResponse = await fetch("http://localhost:8000/projects/" + projectId + '/trees/' + data['result']['id'], {
        method: 'PUT',
        body: JSON.stringify(data['result'])
      });
  
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
