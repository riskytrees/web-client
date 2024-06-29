import React from 'react';
import SettingsAppBar from './SettingsAppBar';
import Stack from '@mui/material/Stack';
import OrgSidebar from './OrgSidebar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { RiskyApi } from './api';
import ProjectSidebar from './ProjectSidebar';

class ProjectSettingsPage extends React.Component<{
}, {
}> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  async handleDeleteProject() {
    const path = window.location.href;
    const projectId = path.split("/")[4];


    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId, {
        method: 'DELETE',
    });

    if (data['ok'] === true ) {
      window.location.href = '/'

    }

  }

  render() {
    
    return (
      <>
      <SettingsAppBar></SettingsAppBar>
      <Stack direction="row">
          <ProjectSidebar></ProjectSidebar>
          <Paper variant="projectarea">
            <Box px='60px'></Box>
            
            <Button onClick={this.handleDeleteProject}> Delete Project</Button>
          </Paper>
        </Stack>
      </>
    )
  }
}

export default ProjectSettingsPage;
