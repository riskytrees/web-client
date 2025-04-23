import React from 'react';
import ProjectTreeList from './ProjectTreeList';
import CreateProjectButton from './CreateProjectButton';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Home from '@mui/icons-material/Home';
import TreeViewPane from './SubTreePane';
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { RiskyRisk } from './Risk';
import LogoMark from './img/logomark.svg';
import personAvatar from './img/person-avatar.png';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Popover from '@mui/material/Popover';
import { FormControl, Grid, Select, TextField } from '@mui/material';
import OrgList from './OrgList';
import CreateOrgButton from './CreateOrgButton';
import bannerback from "./img/bannerback.png";
import LoginLogo from './img/login_logo.png';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import { RiskyApi } from './api';
import InputLabel from '@mui/material/InputLabel';
class PersonalTokenPage extends React.Component<{
}, {
  modalOpen: boolean;
  tokenResult: Record<string, string> | null;
  age: number;
  tokenList: Array<Record<string, string>>;
}> {


  constructor(props) {
    super(props);

    this.state = { modalOpen: false, tokenResult: null, age: 30, tokenList: [] };

    this.createToken = this.createToken.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.revokeToken = this.revokeToken.bind(this);

  }

  async loadTokens() {
    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/auth/personal/tokens", {
      method: 'GET',
    });

    if (data['ok'] === true && data['result']) {
      this.setState({
        tokenList: data['result']
      });
    }
  }

  async componentDidMount() {
    this.loadTokens()
  }

  async createToken() {
    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/auth/personal/tokens", {
      method: 'POST',
      body: JSON.stringify({ expireInDays: this.state.age }),
    });

    if (data['ok'] === true && data['result']['tokenId']) {
      this.setState({
        tokenResult: data['result'],
        modalOpen: true
      }, () => {
        this.loadTokens()
      })

    }
  }

  async revokeToken(tokenId: string) {
    let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + `/auth/personal/tokens/${tokenId}`, {
      method: 'DELETE',
    });

    if (data['ok'] === true) {
      this.setState((prevState) => ({
        tokenList: prevState.tokenList.filter(token => token.tokenId !== tokenId)
      }));
    }
  }

  async handleAgeChange(event) {
    this.setState({
      age: event.target.value
    })
  }

  render() {

    return (
      <>
        <AppBar>
          <Grid container>
            <Grid item xs={4} marginTop="5.75px">
              <Stack spacing={2} direction="row">
                <Box></Box>
                <Button aria-describedby="actionButton" variant='inlineNavButton'><img src={LogoMark} width="25px"></img></Button>

              </Stack>
            </Grid>

            <Grid item xs={4} marginTop="5.75px">
              <Stack alignContent="center">
                <Box display="flex" justifyContent="center" alignItems="center" >
                  <Button variant='inlineNavButton' endIcon={<Home />} onClick={() => {
                    window.location.href = "/";
                  }}>Home</Button>
                </Box>

              </Stack>
            </Grid>
          </Grid>
        </AppBar>


        <Modal
          open={this.state.modalOpen}
          onClose={() => {
            this.setState({
              modalOpen: false,
              tokenResult: null
            })
          }}
        >

          <Box className="riskyModal">
            <Typography variant="h1">New Token</Typography>
            <Typography color='primary'>Please store the following token. It will only be shown one time. </Typography>
            <Box height={"20px"}></Box>
            <TextField slotProps={{
              input: {
                readOnly: true,
              },
            }} label="Token ID" value={this.state.tokenResult ? this.state.tokenResult['tokenId'] : ''}></TextField>
            <Box height={"20px"}></Box>
            <TextField slotProps={{
              input: {
                readOnly: true,
              },
            }} label="Token" value={this.state.tokenResult ? this.state.tokenResult['personalToken'] : ''}></TextField>
          </Box>
        </Modal>

        <Stack direction="row">
          <Paper sx={{marginLeft: 3, marginTop: 10, padding: 1}}>
            <Typography variant='h1'>Tokens</Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Token Expiration</InputLabel>
              <Select
                value={this.state.age}
                label="Age"
                onChange={this.handleAgeChange}
              >

                <MenuItem value={1}>1 Day</MenuItem>
                <MenuItem value={7}>1 Week</MenuItem>
                <MenuItem value={30}>30 Days</MenuItem>
                <MenuItem value={90}>90 Days</MenuItem>
                <MenuItem value={365}>1 Year</MenuItem>

              </Select>
            </FormControl>
            <Button onClick={this.createToken}>Create Personal API Token</Button>

            <List>
              {this.state.tokenList && this.state.tokenList.map(token => (
                <ListItem key={token.tokenId}>
                  <ListItemText primary={`Token ID: ${token.tokenId}`} />
                  <Button onClick={() => this.revokeToken(token.tokenId)}>Revoke</Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Stack>
      </>
    )
  }
}

export default PersonalTokenPage;
