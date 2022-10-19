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
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
class HomePage extends React.Component {

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
          <CreateProjectButton />
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
