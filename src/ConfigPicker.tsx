import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';


class ConfigPicker extends React.Component<{
    projectId: string
}, { 
    availableConfigs: Record<string, any>[]
}>{
  constructor(props) {
    super(props);
    this.state = { availableConfigs: [] };

  }

  async loadAvailableConfigs() {
    let response = await fetch("http://localhost:8000/projects/" + this.props.projectId + "/configs");
    let data = await response.json();
    
    this.setState({
        availableConfigs: data['result']
    });
  }

  render() {
    let menuItemList: JSX.Element[] = [];

    for (const option of this.state['availableConfigs']) {
        for (const id of option['ids']) {
            menuItemList.push(<MenuItem value={id}> Config {id} </MenuItem>)
        }
    }

    return (
      <>
       <FormControl size="small">
                  <InputLabel id="node-type-dropdown-label">Config</InputLabel>
                  <Select
                    labelId="config-dropdown-label"
                    id="config-dropdown"
                    value={null}
                    label="Config"
                    size="small"
                    onChange={undefined}
                  >
                    {menuItemList}
                  </Select>
                </FormControl>
      </>
    )
  }
}

export default ConfigPicker;
