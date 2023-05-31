import React from 'react';
import {ListItemIcon} from "@mui/material"
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TreeData from './interfaces/TreeData';
import { RiskyApi } from './api';


class SubTreePane extends React.Component<{
  projectId: string;
  rootTreeId: string;
}, {
  dag: Record<string, any>
}> {
  constructor(props) {
    super(props);
    this.state = { dag: null };

    this.lineItemClicked = this.lineItemClicked.bind(this);
    this.renderTreeList = this.renderTreeList.bind(this);

  }

  componentDidMount() {
    this.getDag();

  }

  async getDag() {
    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.props.projectId + '/trees/' + this.props.rootTreeId + '/dag/down', {});

    if (data.ok) {
      this.setState({
        dag: data['result']['root']
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      if (this.props.rootTreeId && this.props.projectId) {
        this.getDag();
      }
    }
  }

  lineItemClicked(lineItemId) {
    console.log(lineItemId)

    const stateChangeObj = {};

    if (this.state[lineItemId]) {
        stateChangeObj[lineItemId] = false;
    } else {
        stateChangeObj[lineItemId] = true;
    }


    this.setState(stateChangeObj, () => {
        console.log("State:")
        console.log(this.state)
    })
  }



  renderTreeList(data: Record<string, any>, level: number = 0) {
    if (!data) {
      return null;
    }

    const toReturn: JSX.Element[] = [];
    const key = "line-" + data['id'];

    toReturn.push(<ListItemButton sx={{ ml: (level * 10).toString() + 'px' }} alignItems="flex-start" id={key} key={key} onClick={() => {
      this.lineItemClicked(key)
  }}>
      <ListItemIcon></ListItemIcon>
      <ListItemText primary={data['id']}/>
      {this.state[key] ? <ExpandLess /> : <ExpandMore />}
  </ListItemButton>)

  if (data.children.length > 0) {
    toReturn.push(<Collapse in={this.state[key]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {
                    data.children.map(child => {
                      return this.renderTreeList(child, level + 1)

                    })
                }
            </List>
        </Collapse>
    )

  }

    return toReturn;
  }

  render() {

    return (
      <>
        <List
            sx={{ width: '100%', maxWidth: 360 }}
            aria-labelledby="nested-list-subheader"
            disablePadding
            subheader={
                <ListSubheader id="nested-list-subheader">
                    SubTree Viewer
                </ListSubheader>
            }
        >

        <div>{this.renderTreeList(this.state.dag)}</div>

        </List>
      </>
    )
  }
}

export default SubTreePane;
