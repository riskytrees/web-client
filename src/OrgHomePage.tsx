import React from 'react';
import ProjectsList from './ProjectsList';
import CreateProjectButton from './CreateProjectButton';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Home from '@mui/icons-material/Home';
import TreeViewPane from './SubTreePane';
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { RiskyRisk } from './Risk';
import LogoMark from './img/logomark.svg';
import Popover from '@mui/material/Popover';
import { Grid } from '@mui/material';
import OrgList from './OrgList';
import CreateOrgButton from './CreateOrgButton';
import SettingsAppBar from './SettingsAppBar';

class OrgHomePage extends React.Component<{
}, {
  modalOpen: boolean;
}> {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.teamMembersClicked = this.teamMembersClicked.bind(this);
    this.settingsClicked = this.settingsClicked.bind(this);
  }
  handleOpen() {
    this.setState({ modalOpen: true })
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }

  getOrgId() {
    const path = window.location.href;
    const orgId = path.split("/")[4];

    return orgId;
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

  render() {
    return (
      <>
        <SettingsAppBar></SettingsAppBar>
        <Stack direction="row">
          <Paper variant="riskypane">

            <Box sx={{}}>
              <Button id="primaryButton" onClick={this.handleOpen} variant="primaryButton">New Project</Button>


              <Modal
                open={this.state.modalOpen}
                onClose={this.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >

                <Box className="riskyModal">
                  <Typography variant="h2">Enter Project Name</Typography>
                  <Box height={"20px"}></Box>
                  <Stack direction="column" spacing={2} alignItems="right" justifyContent="center">
                    <CreateProjectButton org={this.getOrgId()} />
                  </Stack>
                </Box>
              </Modal>

              <Box height={"10px"}></Box>
              <nav aria-label="main mailbox folders">

              </nav>
              <Divider />
              <nav aria-label="secondary mailbox folders">
                <List>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText primary="Team Members" onClick={this.teamMembersClicked} />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText primary="Settings" onClick={this.settingsClicked} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
            </Box>

          </Paper>
          <Paper variant="projectarea">
            <Box px='60px'></Box>

            <ProjectsList org={this.getOrgId()} />
          </Paper>
        </Stack>
      </>
    )
  }
}

export default OrgHomePage;
