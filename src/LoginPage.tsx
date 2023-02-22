import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import React from 'react';

class LoginPage extends React.Component <{
}, {
}> {
  constructor(props) {
    super(props);
    this.state = {modalOpen: false,};

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
                    <TextField fullWidth id="outlined-basic" label="Email" variant="outlined" />
                </Paper>
            </Grid>
        </Grid>



      </>
    )
  }
}

export default LoginPage;
