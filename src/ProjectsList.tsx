import React from 'react';
import { RiskyApi } from './api';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Stack from '@mui/material/Stack';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import projectImg from './img/projects_temp.png';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HistoryIcon from '@mui/icons-material/History';
import Popover from '@mui/material/Popover';
import OrgList from './OrgList';
import Divider from '@mui/material/Divider';
import Box from "@mui/material/Box";

class ProjectsList extends React.Component<{
  org: string | undefined;
}, {

  }> {
  constructor(props) {
    super(props);
    this.state = { projects: [], treeCountMap: {} };
    this.loadProjects();

  }

  async loadProjects() {
    this.state = { projects: [] };

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects", {});

    if (data['ok'] === true && data['result']['projects']) {
      // We need counts of the trees in each project
      const treeCountMap = {};
      for (const project of data['result']['projects']) {
        const numTrees = await this.getNumTreesInProject(project.projectId);
        treeCountMap[project.projectId] = numTrees;
      }

      this.setState({
        projects: data['result']['projects'],
        treeCountMap: treeCountMap
      })

    }
  }

  async getNumTreesInProject(projectId): Promise<number | null> {
    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + '/trees', {});

    if (data['ok'] === true && data['result']['trees']) {
      return data['result']['trees'].length;
    }

    return null;
  }

  render() {

    const projects = this.state['projects'];
    const rows: JSX.Element[] = [];

    for (const project of projects) {


      if ((!this.props.org && !project.orgId) || this.props.org === project.orgId) {
        const path = "/projects?id=" + project.projectId;
        rows.push(

          <Card sx={{ maxWidth: 285, m: 2, }} variant="outlined" key={project.projectId}>
            <CardActionArea href={path}>
              <CardMedia
                component="img"
                height="140"
                image={projectImg}
                alt="picture of project map"
              />
              <CardContent><Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="h1" display="inline">
                  {project.name} •
                </Typography> <Typography variant="body1" display="inline">{this.state['treeCountMap'][project.projectId]} Tree{this.state['treeCountMap'][project.projectId] > 1 ? 's' : ''}</Typography></Stack>

                {/*
                  <br></br>
                  <Stack direction="row" alignItems="bottom" gap={1}>
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
                */}

              </CardContent>
            </CardActionArea>
          </Card>)
      }
    }

    return (
      <Grid size={2}>
        <Typography variant="h1" display="block" margin="18px" padding="15px 15px 15px 0px">{this.props.org ? "Org Projects" : "Your Projects"}</Typography>

        <Grid container>

          <Grid>
            <Button aria-describedby="orgSelecter" onClick={this.orgSelecter} variant='inlineFilterButton' startIcon={<PersonOutlineOutlinedIcon fontSize="60" />} endIcon={<ArrowDropDownIcon />} justifyContent="space-between">My Organization</Button>
            <Popover
              id="orgSelecter"
              anchorReference="anchorPosition"
              anchorPosition={{ top: 50, left: 0 }}
              open={this.state.orgSelecterOpen}
              onClose={this.orgSelecterClose}
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
                </List>
              </Stack>

            </Popover>
          </Grid>
          <Stack alignContent="right" direction="row" marginLeft="auto">
            <Box display="flex" justifyContent="right" alignItems="right" >
              <Grid>
                <Button aria-describedby="orgSelecter" onClick={this.orgSelecter} variant='inlineFilterButton' startIcon={<HistoryIcon fontSize="60" />} endIcon={<ArrowDropDownIcon />} justifyContent="space-between">Recent</Button>
              </Grid>
              <Grid marginRight="14px">
                <Button aria-describedby="orgSelecter" onClick={this.orgSelecter} variant='inlineFilterButton' startIcon={<AccountTreeIcon fontSize="60" />} endIcon={<ArrowDropDownIcon />} justifyContent="space-between">Trees</Button>
              </Grid>
            </Box>
          </Stack>
        </Grid>


        <Stack display="flex-row" direction="row" justifyContent="" flexWrap="wrap">

          {rows}
        </Stack>
      </Grid>
    )
  }
}

export default ProjectsList;
