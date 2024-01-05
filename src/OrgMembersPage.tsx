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
import AddUserButton from './AddUserButton';
import { RiskyApi } from './api';
import SettingsAppBar from './SettingsAppBar';
import OrgSidebar from './OrgSidebar';

class OrgMembersPage extends React.Component<{
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
      result.push(<ListItem key={"member-" + member['email']}>{member['email']} <Button onClick={() => {
        this.removeMember(member)
      }}>Remove</Button></ListItem>)
    }

    return <List>{result}</List>;
  }
  

  render() {
    
    return (
      <>
        <SettingsAppBar></SettingsAppBar>
        <Stack direction="row">
          <OrgSidebar></OrgSidebar>
          <Paper variant="treearea">
            <Box px='60px'></Box>
            <Button onClick={this.handleOpen}>Invite User</Button>
            {this.generateOrgUserList()}

          </Paper>
        </Stack>
      </>
    )
  }
}

export default OrgMembersPage;
