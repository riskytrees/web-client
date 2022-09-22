import React from 'react';
import ProjectsList from './ProjectsList';
import CreateProjectButton from './CreateProjectButton';

class HomePage extends React.Component {

  render() {
    return (
      <>
        <h1>riskytrees - Now in technicolor</h1>
        <CreateProjectButton />
        <ProjectsList />
      </>
    )
  }
}

export default HomePage;
