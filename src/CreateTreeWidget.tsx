import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import { RiskyRisk } from './Risk';
import { title } from 'process';
import { RiskyApi } from './api';

class CreateTreeWidget extends React.Component<{
  projectId: string;
}> {
  constructor(props) {
    super(props);
    this.state = {'readyCheck':false};
    this.validate = this.validate.bind(this);
    this.createTreeFromJson = this.createTreeFromJson.bind(this);
  }


  validate(){
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
          modelAttributes: {
            "node_type": {
              "value_string": "or"
            }
          },
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

  async createTreeFromJson(content: Record<string, any>) {
    const treeNameField = document.getElementById("treeNameField");
    const title = (treeNameField as HTMLInputElement).value;
    const projectId = this.props['projectId'];


    let treeCreateResponse = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + '/trees', {
      method: 'POST',
      body: JSON.stringify({
        title
      })
    })

    // Update node ids
    const replacementMap = {}

    const originalRootId = content['rootNodeId'];
    replacementMap[originalRootId] = uuidv4();

    content['rootNodeId'] = replacementMap[originalRootId];
    content['title'] = title;

    // Find root node
    await content['nodes'].forEach((node, idx) => {
      console.log(node)
      if (node.id === originalRootId) {
        content['nodes'][idx]['id'] = replacementMap[originalRootId];
      }
    });

    // Update children
    await content['nodes'].forEach((node, idx) => {
      if (replacementMap[node.id] === null) {
        const newId = uuidv4();
        replacementMap[idx] = newId;
        content['nodes'][idx]['id'] = newId;
      }
    });

    // Now update pointers
    await content['nodes'].forEach((node, idx) => {
      content['nodes'][idx]['children'].forEach((child, childIdx) => {
        if (replacementMap[child] !== null) {
          content['nodes'][idx]['children'][childIdx] = replacementMap[child];
        }
      })
    });

    let addNodeResponse = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + '/trees/' + treeCreateResponse['result']['id'], {
      method: 'PUT',
      body: JSON.stringify(content)
    })

    window.location.reload();


  }

  async importTree() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
      if (e && e.target) {
        const file = e.target['files'][0]; 
        
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = readerEvent => {
          if (readerEvent && readerEvent.target && readerEvent.target.result) {
            const content = JSON.parse(readerEvent.target.result as string);
            this.createTreeFromJson(content);
          }

        }
      }
   }
    input.click();

  }

  render() {
    return (
      <>
        <TextField label="Tree Name" variant="outlined" size="small" id="treeNameField" onChange={this.validate}>
        </TextField>
 
        <Button variant="createButton" onClick={this.createTree.bind(this)} disabled = {!this.state['readyCheck']}>
          Create New Tree
        </Button>
        <Button variant="createButton" onClick={this.importTree.bind(this)} disabled = {!this.state['readyCheck']}>
          Import Tree from File
        </Button>
      </>
    )
  }
}

export default CreateTreeWidget;
