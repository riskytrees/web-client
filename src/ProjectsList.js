import React from 'react';

class ProjectsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: [] };
    this.loadProjects();
  }

  async loadProjects() {
    this.state = { projects: [] };

    let response = await fetch("http://localhost:8000/projects");
    let data = await response.json();

    if (data['result']['projects']) {
      for (const project of data['result']['projects']) {
        this.setState({
          projects: this.state.projects.concat(project)
        })
      }
    }
  }

  render() {

    const projects = this.state.projects;
    const rows = [];

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
