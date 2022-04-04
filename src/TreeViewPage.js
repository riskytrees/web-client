import React from 'react';
import Grid from "@mui/material/Grid";

import TreeViewer from './TreeViewer';

class TreeViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { treeData: {} };
    this.loadTree()

  }

  async loadTree() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');

    let response = await fetch("http://localhost:8000/projects/" + projectId + "/trees/" + treeId);
    let data = await response.json();
    this.setState({
      treeData: data.result
    })
  }

  render() {

    return (
      <>
        <div>{JSON.stringify(this.state.treeData)}</div>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              Tree Viewer Pane
            </Grid>
            <Grid item xs={4}>
              {this.state.treeData && this.state.treeData.nodes && <TreeViewer id="tree_viewer" treeData={JSON.stringify(this.state.treeData)} /> }
            </Grid>
            <Grid item xs={4}>
              Node Editor Pane
            </Grid>
          </Grid>
      </>
    )
  }
}

export default TreeViewPage;
