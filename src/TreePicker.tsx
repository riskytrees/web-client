import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';


class TreePicker extends React.Component<{
    enabled: boolean;
    onSubmit: Function;
    onCancel: Function;
}, {
    inputContent: string;
}> {
  constructor(props) {
    super(props);
    this.state = { inputContent: '' };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  async handleInputChange(event) {
    await this.setState({
        inputContent: event.target.value,
    });
  }

  render() {
    if (!this.props.enabled) {
        return null;
    }

    return (
      <>
        <TextField label="Node ID"  variant="outlined" size="small" value={this.state.inputContent} onChange={this.handleInputChange}>
        
        </TextField>
        <Button onClick={() => this.props.onSubmit(this.state.inputContent)}>Create</Button>
        <Button onClick={() => this.props.onCancel()}>Cancel</Button>

      </>
    );
  }

}

export default TreePicker;
