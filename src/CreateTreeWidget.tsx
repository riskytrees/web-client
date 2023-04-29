import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import { RiskyRisk } from './Risk';
import { title } from 'process';
import { createThis } from 'typescript';
import { RiskyApi } from './api';

class CreateTreeWidget extends React.Component<{
  projectId: string;
}> {
  constructor(props) {
    super(props);
    this.state = {'readyCheck':false};
    this.validate = this.validate.bind(this);
  }


  validate(){
    console.log("Yep")
    const treeNameFieldValidate = document.getElementById("treeNameField") as HTMLInputElement;
    
    if (treeNameFieldValidate) {
      const title = treeNameFieldValidate.value;
    
    if (title.length > 0){
    this.setState( {
      'readyCheck':true
    })}
    else {
    this.setState( {
      'readyCheck':false
    })}
  
  }
  return true
  };

  async createTree() {
    const treeNameField = document.getElementById("treeNameField");
    if (treeNameField) {
      const title = (treeNameField as HTMLInputElement).value;
      const projectId = this.props['projectId'];
  
      let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + '/trees', {
        method: 'POST',
        body: JSON.stringify({
          title
        })
      })

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

      let addNodeResponse = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + '/trees/' + data['result']['id'], {
        method: 'PUT',
        body: JSON.stringify(data['result'])
      })
  
      window.location.reload();
    }

  }

  render() {
    return (
      <>
        
        <TextField label="Tree Name" variant="outlined" size="small" id="treeNameField" onChange={this.validate}>
        </TextField>
 
        <Button variant="createButton" onClick={this.createTree.bind(this)} disabled ={!this.state['readyCheck']}>
          Create New Tree
        </Button>
      </>
    )
  }
}

export default CreateTreeWidget;
