import CreateTreeWidget from './CreateTreeWidget';
import TreesList from './TreesList';
import React from 'react';
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
import { RiskyApi } from './api';
import TextField from '@mui/material/TextField';


class Projects extends React.Component<{

}, {
  modalOpen: boolean;
  renameModalOpen: boolean;
  projectName: any[];
  projectId: string;
}> {
  constructor(props) {
    super(props);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    this.state = { projectId: urlParams.get('id'), projectName: null, modalOpen: false, renameModalOpen: false };

    this.loadCurrentProjectName(this.state['projectId']);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleProjectNameChanged = this.handleProjectNameChanged.bind(this);
  }

  async loadCurrentProjectName(projectId: string) {
    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects", {});

    if (data['result']['projects']) {
      for (const project of data['result']['projects']) {
        if (project.projectId === projectId) {
          this.setState({
            projectName: project.name
          })
        }
      }
    }
  }

  handleOpen() {
    this.setState({ modalOpen: true })
  }

  handleClose() {
    this.setState({ modalOpen: false })
  }

  handleModalOpen() {
    this.setState({ renameModalOpen: true })
  }

  handleModalClose() {
    this.setState({ renameModalOpen: false })
  }

  handleProjectNameChanged() {

  }

  render() {
    return (
      <>
        <AppBar>
          <Box display="flex" justifyContent="center" alignItems="center" marginTop="11.75px">
            <Button id="treeNameSelect" onClick={this.handleModalOpen} variant="text" endIcon={<ArrowDropDownIcon />}>{this.state['projectName']}</Button>
          </Box>

          <Modal
            open={this.state.renameModalOpen}
            onClose={this.handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >

            <Box id="projectDetailsModal">
              <Stack direction="column" spacing={2} alignItems="right" justifyContent="center">
              <TextField label="Project Name" variant="outlined" size="small" onChange={this.handleProjectNameChanged} defaultValue={this.state['projectName']} />

                

              </Stack>
            </Box>

          </Modal>
        </AppBar>
        <Stack direction="row">
          <Paper variant="riskypane" sx={{ backgroundColor: 'rgb(25, 25, 25)', }}>

            <Box sx={{}}>
              <Button id="primaryButton" onClick={this.handleOpen} variant="primaryButton" >New Tree</Button>
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
                    <CreateTreeWidget projectId={this.state['projectId']} />
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
            <Box px='60px'></Box>


            <TreesList projectId={this.state['projectId']} />

          </Paper>
        </Stack>
      </>
    );
  }

}

export default Projects;
