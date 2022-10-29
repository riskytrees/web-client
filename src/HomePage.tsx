import React from 'react';
import ProjectsList from './ProjectsList';
import CreateProjectButton from './CreateProjectButton';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Home from '@mui/icons-material/Home';
import TreeViewPane from './TreeViewPane';
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
class HomePage extends React.Component <{
}, {
  modalOpen: boolean;
}> {
  constructor(props) {
    super(props);
    this.state = {modalOpen: false,};
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }
  handleOpen() {
    this.setState({modalOpen: true})
   }
 
   handleClose() {
     this.setState({modalOpen: false})
   }
  
  render() {
    return (
      <>
      <AppBar>
          <Box display="flex" justifyContent="center" alignItems="center" marginTop="11.75px">
            <Button id="treeNameSelect"  variant="text" endIcon={<Home />}>Home</Button>
          </Box>
          </AppBar>
        <Stack direction="row">
          <Paper variant="riskypane" sx={{backgroundColor:'rgb(25, 25, 25)',}}>
            
          <Box sx={{ }}>
          <Button id="primaryButton" onClick={this.handleOpen} variant="primaryButton">New Project</Button>
          <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >

          <Box id="projectName">
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
        <List>
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

            <ProjectsList />
          </Paper>
        </Stack>
      </>
    )
  }
}

export default HomePage;
