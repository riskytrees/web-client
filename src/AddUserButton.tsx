import React from 'react';
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import { RiskyRisk } from './Risk';
import { title } from 'process';
import { v4 as uuidv4 } from 'uuid';
import { RiskyApi } from './api';

class AddUserButton extends React.Component<{
  orgId: string
}, { readyCheck: boolean }>{
  constructor(props) {
    super(props);
    this.state = { 'readyCheck': false };
    this.validate = this.validate.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  validate() {
    const addUserButtonField = document.getElementById("addUserEmailField") as HTMLInputElement;

    if (addUserButtonField) {
      const email = addUserButtonField.value;

      if (email.length > 0 && email.includes("@") && email.includes('.') && !email.endsWith('.')) {
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


  async addUser() {
    const addUserButtonField = document.getElementById("addUserEmailField") as HTMLInputElement;

    if (addUserButtonField) {
      const email = addUserButtonField.value;
      let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/orgs/" + this.props.orgId + '/members', {
        method: 'POST',
        body: JSON.stringify({
          email
        })
      })

      // Refresh
      window.location.reload()

    }
  };


  render() {
    return (
      <>
        <TextField label="User Email" variant="outlined" size="small" id="addUserEmailField" onChange={this.validate}>
        </TextField>
        <Button id="addUser" variant="createButton" onClick={this.addUser} disabled={!this.state['readyCheck']}>
          Add User
        </Button>
      </>
    )
  }
}

export default AddUserButton;
