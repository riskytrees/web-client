import React from 'react';
import SettingsAppBar from './SettingsAppBar';
import Stack from '@mui/material/Stack';
import OrgSidebar from './OrgSidebar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Avatar from "@mui/material/Avatar";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import profileImg from './img/profile.png';
import { RiskyApi } from './api';
import AddUserButton from './AddUserButton';

class OrgSettingsPage extends React.Component<{
}, {
  modalOpen: boolean;
  orgUsers: Record<string, any>[]
}> {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false, orgUsers: [] };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.teamMembersClicked = this.teamMembersClicked.bind(this);
    this.settingsClicked = this.settingsClicked.bind(this);
  }

  componentDidMount() {
    this.getOrgUsers();
  }

  async getOrgUsers() {
    const path = window.location.href;
    const orgId = path.split("/")[4];

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/orgs/" + orgId + "/members", {});

    if (data['result']['members']) {
      this.setState({
        orgUsers: data['result']['members']
      })

    }

  }

  handleOpen() {
    this.setState({ modalOpen: true })
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }

  teamMembersClicked() {
    const path = window.location.href;
    const orgId = path.split("/")[4];

    window.location.href += "/members"
  }

  settingsClicked() {
    const path = window.location.href;
    const orgId = path.split("/")[4];

    window.location.href += "/settings"
  }

  getOrgId() {
    const path = window.location.href;
    const orgId = path.split("/")[4];
    return orgId;
  }

  async removeMember(member: Record<string, any>) {
    const path = window.location.href;
    const orgId = path.split("/")[4];

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/orgs/" + orgId + "/members", {
      method: 'DELETE',
      body: JSON.stringify({
        email: member['email']
      })
    });

    if (data['ok']) {
      await this.getOrgUsers()
    }

  }

  generateOrgUserList() {
    let result: JSX.Element[] = [];

    for (const member of this.state.orgUsers) {
      result.push(<ListItem sx={{ display: "inline-block", maxWidth: "200px", margin: "0px 34px 24px 0px" }} key={"member-" + member['email']}>
        <Box margin="0px 0px 0px 24px">

          <Stack direction="column" alignItems="center" gap={0.5}>
            <Avatar
              src={profileImg}
              sx={{ width: 180, height: 180 }}></Avatar>
            <Typography variant="h3" display="inline" noWrap={true}>
              {member.email}
            </Typography>
            <Typography variant="h2" display="inline">Admin</Typography>
            {/* <Stack  direction="row" alignItems="bottom" gap={1} >
            <MailIcon fontSize="small"  style={{color: RiskyColors.uiColors.secondaryText}}></MailIcon>
            <Typography variant="body3" alignItems="center" alignContent="center" gutterBottom>
            {member['email']}
            </Typography>
          </Stack> 
    */}
            {/*<Stack direction="row" alignItems="bottom" gap={0.5}>
            <CalendarMonthIcon fontSize="small" style={{color: RiskyColors.uiColors.secondaryText}}></CalendarMonthIcon>
            <Typography variant="body3">
              Jul 1, 1999
            </Typography>
  </Stack>*/}
            <Button variant="deleteButton" startIcon={<DeleteIcon />} onClick={() => {
              this.removeMember(member)
            }}>Remove</Button></Stack>

        </Box></ListItem>)
    }

    return <List>{result}</List>;
  }

  async handleDeleteOrg() {
    const path = window.location.href;
    const orgId = path.split("/")[4];


    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/orgs/" + orgId, {
      method: 'DELETE',
    });

    if (data['ok'] === true) {
      window.location.href = '/'

    }

  }

  render() {
    const path = window.location.href;
    const orgId = path.split("/")[4];

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
                <Box height={"24px"}></Box>
                <Stack alignContent="right" direction="row" marginLeft="auto" display="flex" justifyContent="space-between">

                  <Box>
                    <Typography variant="body3">Users</Typography>
                    <Typography variant="h2">1 included, upgrade for more</Typography>
                    {/* When on free plan, set message to "1 included, upgrade for additional users". When on org plan, we will display the custom terms for that client, but something like "2 included, $25 per additional user"*/}
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
                {this.state.orgUsers.length >= 5 ? <Button variant="primaryButton"> Upgrade</Button> : <Box align="right">
                  <AddUserButton orgId={orgId} max-height="15px"></AddUserButton>
                </Box>}

              </Stack>

              <Grid item xs={2}>


                <Stack display="flex-row" direction="row" justifyContent="start" flexWrap="wrap">
                  {this.generateOrgUserList()}
                </Stack>
              </Grid>

            </Paper>
            <Box height={"60px"}></Box>
          </Paper>
        </Stack>
      </>
    )
  }
}

export default OrgSettingsPage;
