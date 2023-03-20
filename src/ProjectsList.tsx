import React from 'react';
import { RiskyApi } from './api';

class ProjectsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: [] };
    this.loadProjects();
  }

  async loadProjects() {
    this.state = { projects: [] };

    let data = await RiskyApi.call("http://localhost:8000/projects", {});

    if (data['ok'] === true && data['result']['projects']) {
      for (const project of data['result']['projects']) {
        this.setState({
          projects: this.state['projects'].concat(project)
        })
      }
    }
  }

  render() {

    const projects = this.state['projects'];
    const rows: JSX.Element[] = [];

    for (const project of projects) {
      const path = "projects?id=" + project.projectId;
      rows.push(<tr key={project.projectId}><td><a href={path}>{project.name} - {project.projectId}</a></td></tr>)
    }

    return (
      <table>
        <tbody>
          {rows}

        </tbody>
      </table>
    )
  }
}

export default ProjectsList;
