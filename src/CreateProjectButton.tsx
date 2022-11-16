import React from 'react';
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import { RiskyRisk } from './Risk';
import { title } from 'process';
import { v4 as uuidv4 } from 'uuid';


class CreateProjectButton extends React.Component<{

}, { readyCheck: boolean, projectId: string; }>{
  constructor(props) {
    super(props);
    this.state = { 'readyCheck': false, 'projectId': null, };
    this.validate = this.validate.bind(this);
    this.createProject = this.createProject.bind(this);
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

  async createProject() {
    const createProjectButtonField = document.getElementById("createProjectButtonField") as HTMLInputElement;

    console.log("check1")
    if (createProjectButtonField) {
      const title = createProjectButtonField.value;
      console.log("check2")
      let response = await fetch("http://localhost:8000/projects", {
        method: 'POST',
        body: JSON.stringify({
          title
        })
      });
      console.log("check3")
      let data = await response.json();
      console.log("check4")

      //Everything below is news
      this.setState({ projectId: data['result']['id'] })
      console.log(this.state)


      console.log('check5')

      let createTreeResponse = await fetch("http://localhost:8000/projects/" + this.state.projectId + '/trees', {
        method: 'POST',
        body: JSON.stringify({ title: 'Untitled' }),
      });
      data = await createTreeResponse.json();

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

      let addNodeResponse = await fetch("http://localhost:8000/projects/" + this.state.projectId + '/trees/' + data['result']["id"], {
        method: 'PUT',
        body: JSON.stringify(newData)
      });

      window.location.href = "http://localhost:8080/tree?id=" + data['result']["id"] + "&projectId=" + this.state.projectId;
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
