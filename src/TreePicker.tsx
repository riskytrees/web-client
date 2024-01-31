import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { RiskyApi } from './api';
import { JSXElement } from '@babel/types';


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
        {this.generateOptions()}
        <Button onClick={() => this.props.onCancel()}>Cancel</Button>

      </>
    );
  }

}

export default TreePicker;
