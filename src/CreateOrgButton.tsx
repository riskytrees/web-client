import React from 'react';
import TextField from "@mui/material/TextField";
import { Button } from '@mui/material';
import { RiskyRisk } from './Risk';
import { title } from 'process';
import { v4 as uuidv4 } from 'uuid';
import { RiskyApi } from './api';
import HomePage from './HomePage';

class CreateOrgButton extends React.Component<{

}, { readyCheck: boolean, orgId: string; }>{
  constructor(props) {
    super(props);
    this.state = { 'readyCheck': false, 'orgId': null, };
    this.validate = this.validate.bind(this);
    this.createOrg = this.createOrg.bind(this);
  }

  validate() {
    const createOrgButtonField = document.getElementById("createOrgButtonField") as HTMLInputElement;

    if (createOrgButtonField) {
      const title = createOrgButtonField.value;

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


  async createOrg() {
    const createOrgButtonField = document.getElementById("createOrgButtonField") as HTMLInputElement;

    if (createOrgButtonField) {
      const title = createOrgButtonField.value;
      let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/orgs", {
        method: 'POST',
        body: JSON.stringify({
          name: title
        })
      })

      localStorage.setItem(HomePage.SELECTED_ORG_KEY, JSON.stringify(data['result']));

      this.setState({ orgId: data['result']['id'] }, () => {})

      window.location.reload()
    }
  };


  render() {
    return (
      <>
        <TextField label="Org Name" variant="outlined" size="small" id="createOrgButtonField" onChange={this.validate}>
        </TextField>
        <Button id="CreateNewOrg" variant="createButton" onClick={this.createOrg} disabled={!this.state['readyCheck']}>
          Create New Org
        </Button>
      </>
    )
  }
}

export default CreateOrgButton;
