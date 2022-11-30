import { Button, Grid, IconButton, Stack } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';

import Item from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

class ConfigPicker extends React.Component<{
    projectId: string
}, {
    availableConfigs: Record<string, any>[]
}>{
    constructor(props) {
        super(props);
        this.state = { availableConfigs: [] };

        this.loadAvailableConfigs = this.loadAvailableConfigs.bind(this);
        this.addClicked = this.addClicked.bind(this);
        this.editClicked = this.editClicked.bind(this);

    }

    async loadAvailableConfigs() {
        let response = await fetch("http://localhost:8000/projects/" + this.props.projectId + "/configs");
        let data = await response.json();

        this.setState({
            availableConfigs: data['result']
        });
    }

    editClicked() {
        console.log("Edit clicked")
    }

    async addClicked() {
        let response = await fetch("http://localhost:8000/projects/" + this.props.projectId + "/configs", {
            method: 'POST',
            body: JSON.stringify({  }),
        });
        let data = await response.json();
        
        if (data['ok'] === true) {
            this.loadAvailableConfigs();
        }
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
                <Grid container>
                    <Grid item xs={10}>
                        <Item>
                        <FormControl fullWidth size='small'>
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
                        </Item>

                    </Grid>
                    <Grid item xs={1}>
                        <Item>
                        <IconButton onClick={this.editClicked}>
                            <EditIcon></EditIcon>
                        </IconButton>

                        </Item>
                    </Grid>
                    <Grid item  xs={1}>
                        <Item>
                        <IconButton onClick={this.addClicked}>
                            <AddIcon></AddIcon>
                        </IconButton>

                        </Item>

                    </Grid>

                </Grid>

            </>
        )
    }
}

export default ConfigPicker;
