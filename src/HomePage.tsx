import React from 'react';
import ProjectTreeList from './ProjectTreeList';
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
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { RiskyRisk } from './Risk';
import LogoMark from './img/logomark.svg';
import personAvatar from './img/person-avatar.png';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Popover from '@mui/material/Popover';
import { Grid } from '@mui/material';
import OrgList from './OrgList';
import CreateOrgButton from './CreateOrgButton';
import bannerback from "./img/bannerback.png";
import LoginLogo from './img/login_logo.png';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import { RiskyApi } from './api';
class HomePage extends React.Component<{
}, {
  modalOpen: boolean;
  orgModalOpen: boolean;
  orgs: Record<string, unknown>[];
  orgSelecterOpen: boolean;
  selectedOrg: Record<string, unknown> | null;
  filterToTrees: boolean;
}> {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false, orgModalOpen: false, orgs: [], orgSelecterOpen: false, selectedOrg: null, filterToTrees: false };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOrgOpen = this.handleOrgOpen.bind(this);
    this.handleOrgClose = this.handleOrgClose.bind(this);
    this.orgSelecterClicked = this.orgSelecterClicked.bind(this);
    this.orgSelecterClosed = this.orgSelecterClosed.bind(this);
    this.projectTreePickerClicked = this.projectTreePickerClicked.bind(this);

    this.teamMembersClicked = this.teamMembersClicked.bind(this);
    this.settingsClicked = this.settingsClicked.bind(this);

  }

  componentDidMount(): void {
    this.loadOrgs();
  }

  teamMembersClicked() {
    const path = window.location.href;
    const orgId = this.state.selectedOrg.id;

    window.location.href = "/orgs/" + orgId + "/members"
  }

  settingsClicked() {
    const path = window.location.href;
    const orgId = this.state.selectedOrg.id;

    window.location.href = "/orgs/" + orgId + "/settings"
  }

  projectTreePickerClicked() {
    this.setState({
      filterToTrees: !this.state.filterToTrees
    })
  }

  handleOpen() {
    this.setState({ modalOpen: true })
  }

  orgSelecterClicked() {
    this.setState({
      orgSelecterOpen: true
    })
  }

  orgSelecterClosed() {
    this.setState({
      orgSelecterOpen: false
    })
  }

  getOrgId() {
    if (this.state.selectedOrg) {
      return this.state.selectedOrg['id'];
    }

    return null;
  }

  orgSelected(org) {
    this.setState({
      selectedOrg: org
    })
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }
  

  handleOrgOpen() {
    this.setState({ orgModalOpen: true })
  }

  handleOrgClose() {
    this.setState({ orgModalOpen: false })
  }

  async loadOrgs() {
    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/orgs", {});

    if (data['ok'] === true && data['result']['orgs']) {
      this.setState({
        orgs: data['result']['orgs']
      })

    }
  }


  render() {
    let orgListItems: React.JSX.Element[] = [
      <ListItem>
        <ListItemButton onClick={() => {
          this.orgSelected(null);
          this.setState({
            orgSelecterOpen: false
          })
        }}>
          <ListItemText primary={"Personal"} />
        </ListItemButton>
      </ListItem>
    ];

    for (const org of this.state.orgs) {
      orgListItems.push(<ListItem>
        <ListItemButton onClick={() => {
          this.orgSelected(org);
          this.setState({
            orgSelecterOpen: false
          })
        }}>
          <ListItemText primary={org['name']} />
        </ListItemButton>
      </ListItem>)
    }

    let orgSidebarList: React.JSX.Element = null;

    if (this.state.selectedOrg) {
      orgSidebarList = <List>


        <ListItem disablePadding>
          <ListItemButton>
          <SettingsIcon /><Box width={"5px"}></Box><ListItemText primary="Org Settings" onClick={this.settingsClicked} />
          </ListItemButton>
        </ListItem>
      </List>
    }

    return (
      <> 
        <AppBar>
          <Grid container>
            <Grid item xs={4} marginTop="5.75px">
              <Stack spacing={2} direction="row">
                <Box></Box>
                <Button aria-describedby="actionButton" variant='inlineNavButton'><img src={LogoMark} width="25px"></img></Button>
                
              </Stack>
            </Grid>

            <Grid item xs={4} marginTop="5.75px">
              <Stack alignContent="center">
                <Box display="flex" justifyContent="center" alignItems="center" >
                  <Button variant='inlineNavButton' endIcon={<Home />}>Home</Button>
                </Box>

              </Stack>
            </Grid>
          </Grid>


        </AppBar>
        <Stack direction="row">
          <Paper variant="riskypane">

            <Box sx={{}}>
            <Box height='12px'></Box>
              <Button id="primaryButton" onClick={this.handleOpen} startIcon={<AddIcon />} variant="primaryButton" sx={{}}>New Project</Button>
              <Box height='16px'></Box>
              <Button id="orgButton" onClick={this.handleOrgOpen} startIcon={<AddIcon />} variant="secondaryButton">New Org</Button>

              <Modal
                open={this.state.orgModalOpen}
                onClose={this.handleOrgClose}
                aria-labelledby="org-modal-modal-title"
                aria-describedby="org-modal-modal-description"
              >

                <Box className="riskyModal">
                  <Typography variant="h2">Enter Org Name</Typography>
                  <Box height={"20px"}></Box>
                  <Stack direction="column" spacing={2} alignItems="right" justifyContent="center">
                    <CreateOrgButton />
                  </Stack>
                </Box>
              </Modal>

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
                    <CreateProjectButton />
                  </Stack>
                </Box>
              </Modal>

              <Box height={"10px"}></Box>
              <nav aria-label="main mailbox folders">

              </nav>
              <Divider />
              <nav aria-label="secondary mailbox folders">
                  {
                    orgSidebarList
                  }
              </nav>
            </Box>

          </Paper>
          <Paper variant="projectarea">
            <Box height={'24px'}></Box>
            <Grid container>

              <Grid item>
                <Button aria-describedby="orgSelecter" onClick={this.orgSelecterClicked} variant='inlineFilterButton' startIcon={<PersonOutlineOutlinedIcon fontSize="60" />} endIcon={<ArrowDropDownIcon />} justifyContent="space-between">{this.state.selectedOrg ? this.state.selectedOrg.name : "Personal"}</Button>
                <Popover
                  id="orgSelecter"
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: 100, left: 350 }}
                  open={this.state.orgSelecterOpen}
                  onClose={this.orgSelecterClosed}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >

                  <Stack>
                    <List component="nav">
                      {orgListItems}
                    </List>
                  </Stack>

                </Popover>
              </Grid>
              <Stack alignContent="right" direction="row" marginLeft="auto">
                <Box display="flex" justifyContent="right" alignItems="right" >
                  <Grid item>
                    <Button variant='inlineFilterButton' startIcon={<HistoryIcon fontSize="60" />} endIcon={<ArrowDropDownIcon />} justifyContent="space-between">Recent</Button>
                  </Grid>
                  <Grid item marginRight="14px">
                    <Button variant='inlineFilterButton' startIcon={<AccountTreeIcon fontSize="60" />} endIcon={<ArrowDropDownIcon />} justifyContent="space-between" onClick={this.projectTreePickerClicked}> {this.state.filterToTrees ? "Trees" : "Projects"}</Button>

                  </Grid>
                </Box>
              </Stack>
            </Grid>
            <ProjectTreeList org={this.getOrgId()} showTrees={this.state.filterToTrees} />

          </Paper>
        </Stack>
      </>
    )
  }
}

export default HomePage;
