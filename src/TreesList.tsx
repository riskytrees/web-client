import React from 'react';
import { RiskyApi } from './api';
import treeImg from './img/tree.png';
import Box from "@mui/material/Box";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
class TreesList extends React.Component<{
  projectId: string;
}, {
  trees: any[];
}> {
  constructor(props) {
    super(props);
    this.state = { trees: [] };
    this.loadTrees();
  }

  async loadTrees() {
    this.state = { trees: [] };

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.props.projectId + "/trees", {});

    if (data['result']['trees']) {
      for (const tree of data['result']['trees']) {
        this.setState({
          trees: this.state.trees.concat(tree)
        })
      }
    }
  }

  render() {

    const trees = this.state.trees;
    const rows: JSX.Element[] = [];

    for (const tree of trees) {
      const path = "../tree?id=" + tree.id + "&projectId=" + this.props.projectId;
      rows.push(<tr key={tree.id}><td><a href={path}><div className="test1"><div className="imgContainer"><img src={treeImg} width="100%" height="auto"></img></div><div className="itemContent1">{tree.title}</div></div></a></td></tr>)

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

export default TreesList;
