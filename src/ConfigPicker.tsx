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
    availableConfigs: string[],
    selectedConfig: string
}>{
    constructor(props) {
        super(props);
        this.state = { availableConfigs: [], selectedConfig: null };

        this.loadAvailableConfigs = this.loadAvailableConfigs.bind(this);
        this.loadSelectedConfig = this.loadSelectedConfig.bind(this);
        this.addClicked = this.addClicked.bind(this);
        this.editClicked = this.editClicked.bind(this);
        this.configItemClicked = this.configItemClicked.bind(this);

        this.loadAvailableConfigs().then(res => {
            this.loadSelectedConfig();
        })
    }

    async loadAvailableConfigs() {
        let response = await fetch("http://localhost:8000/projects/" + this.props.projectId + "/configs");
        let data = await response.json();
        
        if (data['ok'] === false) {
            this.setState({
                availableConfigs: []
            });
        } else {
            this.setState({
                availableConfigs: data['result']['ids']
            });
        }
    }

    async loadSelectedConfig() {
        let response = await fetch("http://localhost:8000/projects/" + this.props.projectId + "/config");
        let data = await response.json();
        
        if (data['ok'] === false) {
            this.setState({
                selectedConfig: null
            });
        } else {
            this.setState({
                selectedConfig: data['result']['id']
            });
        }
    }

    editClicked() {
        console.log("Edit clicked")
    }

    async switchConfig(desiredConfigId: string) {
        let response = await fetch("http://localhost:8000/projects/" + this.props.projectId + "/config", {
            method: 'PUT',
            body: JSON.stringify({ 
                desiredConfig: desiredConfigId
             }),
        });
        let data = await response.json();
        this.setState({
            selectedConfig: desiredConfigId
        });

        return data['ok'];

    }

    async addClicked() {
        let response = await fetch("http://localhost:8000/projects/" + this.props.projectId + "/configs", {
            method: 'POST',
            body: JSON.stringify({ 
                attributes: {}
             }),
        });
        let data = await response.json();
        
        if (data['ok'] === true) {
            await this.loadAvailableConfigs();

            // Now switch to it
            await this.switchConfig(data['result']['id']);
        }
    }

    async configItemClicked(event) {
        return await this.switchConfig(event.target.value)
    }

    render() {
        let menuItemList: JSX.Element[] = [];

        for (const optionId of this.state['availableConfigs']) {
            menuItemList.push(<MenuItem value={optionId}> Config {optionId} </MenuItem>)
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
                                value={this.state.selectedConfig}
                                label="Config"
                                size="small"
                                onChange={this.configItemClicked}
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
