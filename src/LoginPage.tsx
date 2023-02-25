import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiskyApi } from './api';

class LoginPage extends React.Component <{
}, {
}> {
  constructor(props) {
    super(props);
    this.state = {modalOpen: false, email: ""};

    this.handleEmailChanged = this.handleEmailChanged.bind(this);
    this.loginClicked = this.loginClicked.bind(this);
  }

  componentDidMount() {
    this.handleCodeIfApplicable();
  }

  async handleCodeIfApplicable() {
    const queryParameters = new URLSearchParams(window.location.search)
    const code = queryParameters.get("code")
    const state = queryParameters.get("state")

    if (code && code !== "") {
      // Forward request to backend and extract token
      let response = await fetch("http://localhost:8000/auth/login?code=" + encodeURIComponent(code) + "&state=" + encodeURIComponent(state));
      let authData = await response.json();
      if (authData.result.sessionToken) {
        localStorage.setItem('sessionToken', authData.result.sessionToken);

        window.location.href = "/";
      }
    }
  }

  async loginClicked() {
    console.log(this.state['email'])
    let response = await fetch("http://localhost:8000/auth/login?provider=google", {
      method: 'POST',
      body: JSON.stringify({
        email: this.state['email']
      })
    });


    let authTriggerResp = await response.json();

    let loginRequest = authTriggerResp['result']['loginRequest'];

    window.location.href = loginRequest;

  }

  async handleEmailChanged(event) {
    const proposedName = event.target.value;

    this.setState({
      email: proposedName
    })
  }
  
  render() {
    return (
      <>
        <Grid container spacing={0}>
            <Grid item xs={7}>
                <Paper>
                    RISKYTREES
                </Paper>
            </Grid>
            <Grid item xs={5}>
                <Paper>
                    <TextField fullWidth id="outlined-basic" label="Email" variant="outlined" onChange={this.handleEmailChanged} />
                    <Button onClick={this.loginClicked}>Login or Create an Account</Button>
                </Paper>
            </Grid>
        </Grid>



      </>
    )
  }
}

export default LoginPage;
