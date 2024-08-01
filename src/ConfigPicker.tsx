import { Button, Grid, IconButton, Stack } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';

import Item from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { RiskyApi } from './api';

class ConfigPicker extends React.Component<{
    projectId: string
}, {
    availableConfigs: Record<string, unknown>[],
    selectedConfig: string | null
}>{
    constructor(props) {
        super(props);
        this.state = { availableConfigs: [], selectedConfig: null };

        this.loadAvailableConfigs = this.loadAvailableConfigs.bind(this);
        this.loadSelectedConfig = this.loadSelectedConfig.bind(this);
        this.addClicked = this.addClicked.bind(this);
        this.editClicked = this.editClicked.bind(this);
        this.configItemClicked = this.configItemClicked.bind(this);


    }

    async componentDidMount(): Promise<void> {
        await this.loadAvailableConfigs();
        await this.loadSelectedConfig();

    }

    async loadAvailableConfigs() {
        let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.props.projectId + "/configs", {});
        
        if (data['ok'] === false) {
            this.setState({
                availableConfigs: []
            });
        } else {
            const fullConfigs: Record<string, unknown>[] = [];

            for (const configId of data['result']['ids']) {
                let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.props.projectId + "/configs/" + configId, {});

                fullConfigs.push({
                    id: configId,
                    name: data['result']['name']
                })
            }

            this.setState({
                availableConfigs: fullConfigs
            });
        }
    }

    async loadSelectedConfig() {
        let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.props.projectId + "/config", {});

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
        window.location.href = "/projects/" + this.props.projectId + "/config/" + this.state.selectedConfig;
    }

    async switchConfig(desiredConfigId: string) {
        let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.props.projectId + "/config", {
            method: 'PUT',
            body: JSON.stringify({ 
                desiredConfig: desiredConfigId
             }),
        })

        this.setState({
            selectedConfig: desiredConfigId
        });

        return data['ok'];

    }

    async addClicked() {
        let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.props.projectId + "/configs", {
            method: 'POST',
            body: JSON.stringify({ 
                attributes: {}
             }),
        })
        
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

        for (const option of this.state['availableConfigs']) {
            menuItemList.push(<MenuItem value={option.id}> {option.name ? option.name : option.id} </MenuItem>)
        }

        return (
            <>
                <Grid container>
                    <Grid item xs={10}>
                        <Item>
                        <FormControl fullWidth size='small'>
                            <InputLabel id="config-dropdown-label">Config</InputLabel>
                            <Select
                                labelId="config-dropdown-label"
                                id="config-dropdown"
                                value={this.state.selectedConfig}
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
