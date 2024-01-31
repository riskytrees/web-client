import React from 'react';
import { RiskyApi } from './api';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Stack from '@mui/material/Stack';
import Grid from "@mui/material/Grid";
import Card from '@mui/material/Card';
import projectImg from './img/projects_temp.png';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea, CardActions, Modal } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CreateOrgButton from './CreateOrgButton';

class OrgList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { orgs: [] };
    this.loadOrgs();
  }

  async loadOrgs() {
    this.state = { orgs: [] };

    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/orgs", {});

    if (data['ok'] === true && data['result']['orgs']) {
      this.setState({
        orgs: data['result']['orgs']
      })

    }
  }

  render() {

    const orgs = this.state['orgs'];
    const rows: JSX.Element[] = [];

    for (const org of orgs) {
      const path = "orgs/" + org.id;
      rows.push(

        <Card sx={{ maxWidth: 285, m: 2, }} variant="outlined" key={org.id}>
          <CardActionArea href={path}>
            <CardMedia
              component="img"
              height="140"
              image={projectImg}
              alt="picture of project map"
            />
            <CardContent>

              <Stack direction="row" alignItems="bottom" gap={1}>
                <PersonIcon fontSize="small"></PersonIcon>
                <Typography variant="body2" gutterBottom>
                  {org.name}
                </Typography>
                •
                <Typography variant="body2" gutterBottom>
                  [# Projects]
                </Typography>
              </Stack>


            </CardContent>
          </CardActionArea>
        </Card>)
    }

    return (
      <>
      <Grid item xs={2}>
      
        <Stack display="flex-row" direction="row" justifyContent="" flexWrap="wrap">

          {rows}

        </Stack>
      </Grid>
    </>
    )
  }
}

export default OrgList;
