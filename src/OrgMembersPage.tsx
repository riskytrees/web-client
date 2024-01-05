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
import { CardActionArea, CardActions } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Card from '@mui/material/Card';
import projectImg from './img/projects_temp.png';


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
      result.push(<ListItem key={"member-" + member['email']}><Box>
<Paper variant="outlined" borderRadius="50px">
   <img src={projectImg} height="140px"/>
</Paper>
<Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="h1" display="inline">
          {member['email']} •
          </Typography> <Typography variant="body1" display="inline">[#]Trees</Typography></Stack>
  
          <br></br><Stack direction="row" alignItems="bottom" gap={1}>
            <PersonIcon fontSize="small"></PersonIcon>
            <Typography variant="body2" gutterBottom>
              [Personal]
            </Typography>
          </Stack>
  
          <Stack direction="row" alignItems="bottom" gap={1}>
            <CalendarMonthIcon fontSize="small"></CalendarMonthIcon>
            <Typography variant="body2">
              [DateModified]
            </Typography>
          </Stack>
          <Button onClick={() => {
        this.removeMember(member)
      }}>Remove</Button>

 </Box></ListItem> )
    }

    return <List>{result}</List>;
  }
  

  render() {
    
    return (
      <>
        <AppBar>
          <Grid container>
            <Grid item xs={4} marginTop="11.75px">
              <Stack spacing={2} direction="row">
                <Box></Box>
                <Button aria-describedby="actionButton" onClick={this.handleActionPanelOpen} variant='inlineNavButton' endIcon={<ArrowDropDownIcon />}><img src={LogoMark} width="25px"></img></Button>
                <Popover
                  id="actionButton"
                  anchorReference="anchorPosition"
                  anchorPosition={{ top: 50, left: 0 }}
                  open={this.state.actionModalOpen}
                  onClose={this.handleActionPanelClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                >
                  <Stack>
                    <List component="nav">
                      <ListItem>
                        <ListItemButton onClick={this.goBackToProjects}>
                          <ListItemText primary="Back to Trees" />
                        </ListItemButton>
                      </ListItem>

                      <ListItem>
                        <ListItemButton disabled={true}>
                          <ListItemText primary="Export Text Tree" />
                        </ListItemButton>
                      </ListItem>

                      <ListItem>
                        <ListItemButton disabled={true}>
                          <ListItemText primary="Export Analysis" />
                        </ListItemButton>
                      </ListItem>

                      <Divider light />

                      <ListItem>
                        <ListItemButton>
                          <ListItemText primary="Undo" onClick={this.handleUndo} />
                        </ListItemButton>
                      </ListItem>


                      <Divider light />

                      <ListItem>
                        <ListItemButton disabled={true}>
                          <ListItemText primary="Add Child Node" />
                        </ListItemButton>
                      </ListItem>

                      <ListItem>
                        <ListItemButton disabled={true}>
                          <ListItemText primary="Delete Selected" />
                        </ListItemButton>
                      </ListItem>

                      <Divider light />
                      <ListItem>
                        <ListItemButton disabled={true}>
                          <ListItemText primary="Config Settings" />
                        </ListItemButton>
                      </ListItem>

                      <ListItem>
                        <ListItemButton disabled={true}>
                          <ListItemText primary="Model Settings" />
                        </ListItemButton>
                      </ListItem>

                      <Divider light />
                      <ListItem>
                        <ListItemButton disabled={true}>
                          <ListItemText primary="App Settings" />
                        </ListItemButton>
                      </ListItem>

                    </List>
                  </Stack>

                </Popover>
              </Stack>
            </Grid>

            <Grid item xs={4} marginTop="11.75px">
              <Stack alignContent="center">
                <Box display="flex" justifyContent="center" alignItems="center" >
                  <Button variant='inlineNavButton' endIcon={<Home />} onClick={() => {
                    window.location.href = "/"
                  }}>Home</Button>
                </Box>

              </Stack>
            </Grid>
          </Grid>


        </AppBar>
        <Stack direction="row">
          <Paper variant="riskypane" sx={{ backgroundColor: 'rgb(25, 25, 25)', }}>

            <Box sx={{}}>
              <Button id="primaryButton" onClick={this.handleOpen} variant="primaryButton">New Project</Button>


              <Modal
                open={this.state.modalOpen}
                onClose={this.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >

                <Box className="riskyModal">
                  <Typography variant="h2">Enter Member Email</Typography>
                  <Box height={"20px"}></Box>
                  <Stack direction="column" spacing={2} alignItems="right" justifyContent="center">
                    <AddUserButton orgId={this.getOrgId()}></AddUserButton>
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
                      <ListItemText primary="Trash" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton component="a" href="#simple-list">
                      <ListItemText primary="Spam" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </nav>
            </Box>

          </Paper>
          <Paper variant="treearea">
            <Box px='60px'></Box>
            <Grid item xs={2}>        
            <Stack display="flex-row" direction="row" justifyContent="space-between" padding="15px 15px 15px 0px" margin="18px">
        <Typography variant="h1" display="block" >{this.props.org ? "Org Projects" : "Your Projects"}</Typography>
        <Button onClick={this.handleOpen} max-height="15px">Invite User</Button>
        </Stack>    
        <Stack display="flex-row" direction="row" justifyContent="" flexWrap="wrap">
        {this.generateOrgUserList()}
        </Stack>
      </Grid>padding="15px 15px 15px 0px"



          </Paper>
        </Stack>
      </>
    )
  }
}

export default OrgMembersPage;
