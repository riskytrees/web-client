import React from 'react';
import SettingsAppBar from './SettingsAppBar';
import Stack from '@mui/material/Stack';
import OrgSidebar from './OrgSidebar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
          <Paper variant="projectarea">
            
          <Box height={"60px"}></Box>
            
            
              <Paper variant="settingscard">
              <Stack alignContent="right" direction="row" marginLeft="auto" display="flex" justifyContent="space-between">
                <Box>
                <Typography variant="h1">RiskyTrees LLC</Typography>
                <Typography variant="h2">Created Jul 12, 2024</Typography>
                </Box>
                <Box align="right"><Button variant="deleteButton" startIcon={<DeleteIcon />} onClick={this.handleDeleteOrg}> Delete Org</Button></Box>
                </Stack>

                
                
                <Box height={"36px"}></Box>

                  <Paper variant="settingsblock">
                  <Stack alignContent="right" direction="row" marginLeft="auto" display="flex" justifyContent="space-between">

                  <Box>
                  <Typography variant="body3">ORGNAME</Typography>
                  <Typography variant="h2">Name</Typography>
                  </Box>
                  <Box flex-direction="right">
                  <Button > Edit Name</Button>
                  </Box>
                  </Stack>
                  <Box height={"24px"}></Box>
                  <Stack alignContent="right" direction="row" marginLeft="auto" display="flex" justifyContent="space-between">

                    <Box>
                      <Typography variant="body3">Plan</Typography>
                      <Typography variant="h2">Free</Typography>
                    </Box>
                    
                    <Box flex-direction="right">
                      <Button variant="primaryButton"> Upgrade</Button>
                    </Box>

</Stack>
                  </Paper>
                  <Box height={"36px"}></Box>
                  <Paper variant="settingsblock">
                  <Stack alignContent="right" direction="row" marginLeft="auto" display="flex" justifyContent="space-between">

                  <Box>
                  <Typography variant="body3">Billing Cycle</Typography>
                  <Typography variant="h2">N/A</Typography>
                  </Box>
        
                  </Stack>
                  <Box height={"24px"}></Box>
                  <Stack alignContent="right" direction="row" marginLeft="auto" display="flex" justifyContent="space-between">

                    <Box>
                      <Typography variant="body3">Users</Typography>
                      <Typography variant="h2">1 included, upgrade for more</Typography>
                      {/* When on free plan, set message to "1 included, upgrade for additional users". When on org plan, we will display the custom terms for that client, but something like "2 included, $25 per additional user"*/}
                    </Box>
 

</Stack>
<Box height={"24px"}></Box>
                        <Stack alignContent="right" direction="row" marginLeft="auto" display="flex" justifyContent="space-between">

                        <Box>
                          <Typography variant="body3">Credit card</Typography>
                          <Typography variant="h2">VISA - 3013</Typography>
                        </Box>

                        <Box flex-direction="right">
                          <Button> Update</Button>
                        </Box>

                        </Stack>
                  </Paper>
              </Paper>
            
              <Box height={"36px"}></Box>
              <Paper variant="settingscard">
              <Stack alignContent="right" direction="row" marginLeft="auto" display="flex" justifyContent="space-between">
                <Box>
                <Typography variant="h1">Manage Users</Typography>
                </Box>
                <Box align="right"><Button variant="addButton" startIcon={<AddIcon />} onClick={this.handleDeleteOrg}> Invite User</Button></Box>
                </Stack>

            
                
              </Paper>
            
          </Paper>
        </Stack>
      </>
    )
  }
}

export default OrgSettingsPage;
