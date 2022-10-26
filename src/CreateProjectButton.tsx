import React from 'react';
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import { RiskyRisk } from './Risk';
import { title } from 'process';

class CreateProjectButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'readyCheck':false};
    this.validate = this.validate.bind(this);
  }
 
 validate(){
  console.log("Yep")
  const createProjectButtonField = document.getElementById("createProjectButtonField") as HTMLInputElement;
  
  if (createProjectButtonField) {
    const title = createProjectButtonField.value;
  
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
    };
  }

  render() {
    return (
      <>
        <TextField label="Project Name" variant="outlined" size="small" id="createProjectButtonField" onChange={this.validate}>
        </TextField>
        <Button id="CreateNewProject" variant="createButton" onClick={this.createProject} disabled ={!this.state['readyCheck']}>
          Create New Project
        </Button>
      </>
    )
  }
}

export default CreateProjectButton;
