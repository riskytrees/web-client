import CreateTreeWidget from './CreateTreeWidget';
import TreesList from './TreesList';
import React from 'react';

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

class NodePane extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <>
      <Stack>
      <TextField id="outlined-basic" label="Node Name" variant="outlined" />

      </Stack>

      </>
    );
  }

}

export default NodePane;
