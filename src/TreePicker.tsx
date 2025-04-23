import { Card, CardContent, CardHeader, Grid, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { RiskyApi } from './api';
import CancelIcon from '@mui/icons-material/Cancel';

class TreePicker extends React.Component<{
  enabled: boolean;
  onSubmit: Function;
  onCancel: Function;
}, {
  inputContent: string;
  treeOptions: Record<string, string>[]
}> {
  constructor(props) {
    super(props);
    this.state = { inputContent: '', treeOptions: [] };

    this.loadTreeOptions()
  }

  async loadTreeOptions() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const projectId = urlParams.get('projectId');
    const treeId = urlParams.get('id');


    let result = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees", {});
    const treeOptions: Record<string, string>[] = [];

    for (const tree of result.result.trees) {
      result = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/trees/" + tree['id'], {});


      treeOptions.push({
        "title": tree['title'],
        "id": tree['id'],
        "rootId": result.result.rootNodeId
      })
    }

    this.setState({
      treeOptions: treeOptions
    })
  }

  generateOptions() {

    const result: React.JSX.Element[] = [];
    for (const tree of this.state.treeOptions) {
      result.push(<Button key={tree['rootId']} onClick={() => this.props.onSubmit(tree['rootId'])}>{tree['title']}</Button>)
    }

    return result;
  }

  render() {
    if (!this.props.enabled) {
      return null;
    }

    return (
      <>
        <Card variant="outlined">
          <CardHeader title="Add a Subtree" action={
            <IconButton onClick={() => this.props.onCancel()}>
              <CancelIcon></CancelIcon>
            </IconButton>
          }>
          </CardHeader>
          <CardContent>
            <Stack spacing={1}>
              <Typography>From Project</Typography>
              {this.generateOptions()}
              <Typography>From Community</Typography>
              <Grid container>
                <Grid size={8}>
                  <TextField id="customNodeId" label="Node ID" size="small"></TextField>
                </Grid>
                <Grid size={1}></Grid>
                <Grid size={3}>
                  <Button onClick={() => {
                    const nodeId = document.getElementById("customNodeId").value;
                    if (nodeId && nodeId !== '') {
                      this.props.onSubmit(nodeId)

                    }
                  }}>Add</Button>
                </Grid>

              </Grid>
            </Stack>
          </CardContent>
        </Card>





      </>
    );
  }

}

export default TreePicker;
