import React from 'react';
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import { RiskyRisk } from './Risk';
import { title } from 'process';
import { v4 as uuidv4 } from 'uuid';
import { RiskyApi } from './api';

class CreateProjectButton extends React.Component<{
  org: string | undefined
}, { readyCheck: boolean, projectId: string; }>{
  constructor(props) {
    super(props);
    this.state = { 'readyCheck': false, 'projectId': null, };
    this.validate = this.validate.bind(this);
    this.createProject = this.createProject.bind(this);
    this.createTree = this.createTree.bind(this);
  }

  validate() {
    console.log("Yep")
    const createProjectButtonField = document.getElementById("createProjectButtonField") as HTMLInputElement;

    if (createProjectButtonField) {
      const title = createProjectButtonField.value;

      if (title.length > 0) {
        this.setState({
          'readyCheck': true
        })
      }
      else {
        this.setState({
          'readyCheck': false
        })
      }

    }
    return true
  };

  async createTree(title) {
    const data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.state.projectId + '/trees', {
      method: 'POST',
      body: JSON.stringify({ title: 'Untitled' }),
    })

    const newRootNodeId = uuidv4();
    let newData = {
      title,
      rootNodeId: newRootNodeId,
      nodes: [
        {
          title: "New Root node",
          description: "This is the root node",
          modelAttributes: {},
          conditionAttribute: "",
          id: newRootNodeId,
          children: []
        }
      ]
    }

    await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.state.projectId + '/trees/' + data['result']["id"], {
      method: 'PUT',
      body: JSON.stringify(newData)
    })


    window.location.href = process.env.REACT_APP_CLIENT_ROOT_URL + "/tree?id=" + data['result']["id"] + "&projectId=" + this.state.projectId;
  }

  async createProject() {
    const createProjectButtonField = document.getElementById("createProjectButtonField") as HTMLInputElement;

    if (createProjectButtonField) {
      const title = createProjectButtonField.value;
      let payload = {
        title
      }

      if (this.props.org) {
        payload['orgId'] = this.props.org
      }

      let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects", {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      this.setState({ projectId: data['result']['id'] }, () => this.createTree(title))


    }
  };


  render() {
    return (
      <>
        <TextField label="Project Name" variant="outlined" size="small" id="createProjectButtonField" onChange={this.validate}>
        </TextField>
        <Button id="CreateNewProject" variant="createButton" onClick={this.createProject} disabled={!this.state['readyCheck']}>
          Create New Project
        </Button>
      </>
    )
  }
}

export default CreateProjectButton;
