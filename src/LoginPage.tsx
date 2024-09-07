import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import React from 'react';
import { Link, Stack } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { RiskyApi } from './api';
import Image from '@jy95/material-ui-image';
import LoginBackground from './img/login_background.png';
import LoginLogo from './img/login_logo.png';
import Typography from "@mui/material/Typography";

class LoginPage extends React.Component<{
}, {
  }> {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false, email: "" };

    this.handleEmailChanged = this.handleEmailChanged.bind(this);
    this.loginClicked = this.loginClicked.bind(this);
    this.signinWithGoogleClicked = this.signinWithGoogleClicked.bind(this);
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
      let response = await fetch(process.env.REACT_APP_API_ROOT_URL + "/auth/login?code=" + encodeURIComponent(code) + "&state=" + encodeURIComponent(state));
      let authData = await response.json();
      if (authData.result.sessionToken) {
        localStorage.setItem('sessionToken', authData.result.sessionToken);

        window.location.href = "/";
      }
    }
  }

  async loginClicked() {
    let response = await fetch(process.env.REACT_APP_API_ROOT_URL + "/auth/login?provider=google", {
      method: 'POST',
      body: JSON.stringify({
        email: this.state['email']
      })
    });


    let authTriggerResp = await response.json();

    let loginRequest = authTriggerResp['result']['loginRequest'];

    window.location.href = loginRequest;

  }

  async signinWithGoogleClicked() {
    let response = await fetch(process.env.REACT_APP_API_ROOT_URL + "/auth/login?provider=google", {
      method: 'POST',
      body: JSON.stringify({

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


        <Paper variant="loginback">
          <Paper variant="loginBox">

            <Paper variant="loginlogo">
              <img src={LoginLogo} width="50%"></img>
            </Paper>
            {/* <img src={LoginBackground} width="100%" height="100%"></img> */}
          </Paper>
          <Paper variant="loginpane" sx={{ backgroundColor: 'rgb(25, 25, 25)', paddingLeft: '60px', paddingRight: '60px' }}>
            <Stack justifyContent="center" direction="column" alignItems="left" spacing={0} height="100%">
              <Typography variant="h1">Login</Typography>
              <Box height={"40px"}></Box>
              <button class="gsi-material-button" onClick={this.signinWithGoogleClicked}>
                <div class="gsi-material-button-state"></div>
                <div class="gsi-material-button-content-wrapper">
                  <div class="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span class="gsi-material-button-contents">Continue with Google</span>
                  <span style={{ display: "none" }}>Continue with Google</span>
                </div>
              </button>
              {/*<TextField fullWidth id="outlined-basic" label="Email" variant="outlined" size="small" onChange={this.handleEmailChanged} />
              <Box height={"20px"}></Box>
              <Button variant="primaryButton" onClick={this.loginClicked}>Enter</Button>*/}
              <Box height={"20px"}></Box>
              <Typography variant="caption">By signing up you confirm that you have read and agree to our <Link href="https://riskytrees.com/privacy-policy">privacy policy</Link> and <Link href="https://riskytrees.com/terms-of-use">terms of service</Link>. </Typography>
            </Stack>


          </Paper>
        </Paper>




      </>
    )
  }
}

export default LoginPage;
