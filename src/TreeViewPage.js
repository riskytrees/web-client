import React from 'react';
import Grid from "@mui/material/Grid";

import TreeViewer from './TreeViewer';
import NodePane from './NodePane';

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
        <div class='RiskyNavBar'>
        </div>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <div class='RiskyPane'>
              Tree Viewer Pane
              </div>
            </Grid>
            <Grid item xs={6}>
              {this.state.treeData && this.state.treeData.nodes && <TreeViewer id="tree_viewer" treeData={JSON.stringify(this.state.treeData)} /> }
            </Grid>
            <Grid item xs={3}>
              <div class='RiskyPane'>
                <NodePane>
                </NodePane>
              </div>
            </Grid>
          </Grid>
      </>
    )
  }
}

export default TreeViewPage;
