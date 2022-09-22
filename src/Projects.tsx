import CreateTreeWidget from './CreateTreeWidget';
import TreesList from './TreesList';
import React from 'react';

class Projects extends React.Component {
  constructor(props) {
    super(props);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    this.state = { projectId: urlParams.get('id') };
  }

  render() {
    return (
      <>
      <h1>Trees</h1>

      <CreateTreeWidget projectId={this.state['projectId']}/>

      <TreesList projectId={this.state['projectId']} />

      <script>

      </script>
      </>
    );
  }

}

export default Projects;
