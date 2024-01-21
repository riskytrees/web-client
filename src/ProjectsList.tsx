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

class ProjectsList extends React.Component<{
  org: string | undefined;
}, {

  }> {
  constructor(props) {
    super(props);
    this.state = { projects: [] };
    this.loadProjects();
  }

  async loadProjects() {
    this.state = { projects: [] };

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects", {});

    if (data['ok'] === true && data['result']['projects']) {
      this.setState({
        projects: data['result']['projects']
      })

    }
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

              </CardContent>
            </CardActionArea>
          </Card>)
      }
    }

    return (
      <Grid item xs={2}>
        <Typography variant="h1" display="block" margin="18px" padding="15px 15px 15px 0px">{this.props.org ? "Org Projects" : "Your Projects"}</Typography>
        <Stack display="flex-row" direction="row" justifyContent="" flexWrap="wrap">

          {rows}
        </Stack>
      </Grid>
    )
  }
}

export default ProjectsList;
