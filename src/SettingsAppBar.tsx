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

class SettingsAppBar extends React.Component<{
}, {  }>{
  constructor(props) {
    super(props);
    this.state = {  };
  }


  render() {
    return (
      <>
        <AppBar>
          <Grid container>
            <Grid size={4} marginTop="5.75px">
              <Stack spacing={2} direction="row">
                <Box></Box>
                <Button aria-describedby="actionButton" onClick={() => {
                    window.location.href = "/"}} variant='inlineNavButton'><img src={LogoMark} width="25px"></img></Button>
                
              </Stack>
            </Grid>

            <Grid size={4} marginTop="5.75px">
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
      </>
    )
  }
}

export default SettingsAppBar;
