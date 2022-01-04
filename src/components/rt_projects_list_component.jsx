
class ProjectsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projectIds: [] };
    this.loadProjects();
  }

  async loadProjects() {
    this.state = { projectIds: [] };

    let response = await fetch("http://localhost:8000/projects");
    let data = await response.json();

    if (data['result']['projects']) {
      for (const projectId of data['result']['projects']) {
        this.setState({
          projectIds: this.state.projectIds.concat(projectId)
        })
      }
    }
  }

  render() {

    const projectIds = this.state.projectIds;
    const rows = [];

    for (const projectId of projectIds) {
      const path = "projects/index.html?id=" + projectId;
      rows.push(<tr key={projectId}><td><a href={path}>{projectId}</a></td></tr>)
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

const domContainer = document.querySelector('#rt_projects_list_component');
ReactDOM.render(<ProjectsList />, domContainer);
