import React from 'react';
import { RiskyApi } from './api';
import treeImg from './img/tree.png';
import Box from "@mui/material/Box";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
class TreesList extends React.Component<{
  projectId: string;
  projectName: string;
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

  handleBackClick() {
    window.location.href = "/";
  }


  render() {

    const trees = this.state.trees;
    const rows: JSX.Element[] = [];

    for (const tree of trees) {
      const path = "../tree?id=" + tree.id + "&projectId=" + this.props.projectId;

      rows.push(

        <Card sx={{ maxWidth: 285, m: 2, }} variant="outlined" key={tree.id}>
          <CardActionArea href={path}>
            <CardMedia
              component="img"
              height="140"
              image={treeImg}
              alt="picture of project map"
            />
            <CardContent><Stack direction="row" alignItems="center" gap={1}>
              <Typography variant="h1" display="inline">
                {tree.title} •
              </Typography> <Typography variant="body1" display="inline">[#]subtrees</Typography></Stack>

              <br></br><Stack direction="row" alignItems="bottom" gap={1}>
                <PersonIcon fontSize="small"></PersonIcon>
                <Typography variant="body2" gutterBottom>
                  [Personal]
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="bottom" gap={1}>
                <CalendarMonthIcon fontSize="small"></CalendarMonthIcon>
                <Typography variant="body2">
                  [DateModified]
                </Typography>
              </Stack>

            </CardContent>
          </CardActionArea>
        </Card>)

    }

    return (

      <Grid item xs={2}><Stack direction="row" padding="15px" alignItems="Center"><IconButton onClick={this.handleBackClick} >{<ArrowBackIcon />}</IconButton><Typography variant="h1" display="inline" margin="18px" >{this.props.projectName}</Typography></Stack>
        <Stack display="flex-row" direction="row" justifyContent="" flexWrap="wrap">
          {rows}
        </Stack>
      </Grid>
    )
  }
}

export default TreesList;
