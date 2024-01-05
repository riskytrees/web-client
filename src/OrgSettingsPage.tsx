import React from 'react';
import SettingsAppBar from './SettingsAppBar';
import Stack from '@mui/material/Stack';
import OrgSidebar from './OrgSidebar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RiskyApi } from './api';

class OrgSettingsPage extends React.Component<{
}, {
}> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  async handleDeleteOrg() {
    const path = window.location.href;
    const orgId = path.split("/")[4];


    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/orgs/" + orgId, {
        method: 'DELETE',
    });

    if (data['ok'] === true ) {
      window.location.href = '/'

    }

  }

  render() {
    
    return (
      <>
      <SettingsAppBar></SettingsAppBar>
      <Stack direction="row">
          <OrgSidebar></OrgSidebar>
          <Paper variant="treearea">
            <Box px='60px'></Box>
            
            <Button onClick={this.handleDeleteOrg}> Delete Org</Button>
          </Paper>
        </Stack>
      </>
    )
  }
}

export default OrgSettingsPage;
