import { Button, Grid, IconButton, Stack, TextField } from '@mui/material';
import React from 'react';
import Item from '@mui/material/Grid';
import { RiskyApi } from './api';
import { JsonViewer } from '@textea/json-viewer';

class ConfigEditorPage extends React.Component<{
}, {
    configJsonValue: string;
    projectId: string | null;
    configId: string | null;
}>{
    constructor(props) {
        super(props);
        this.state = { configJsonValue: "", projectId: null, configId: null };
    }

    async componentDidMount(): Promise<void> {
        let projectId = await this.getProjectIdFromURL();
        this.setState({
            projectId: projectId
        });

        let configId = await this.getConfigIdFromURL();
        this.setState({
            configId: configId
        });

        this.loadInitialConfig(projectId, configId);

    }

    loadInitialConfig = async (projectId: string, configId: string) => {
        let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + projectId + "/configs/" + configId, {});
        
        if (data.ok) {
            let attributes = data.result.attributes;

            this.setState({
                "configJsonValue": JSON.stringify(data.result.attributes)
            })
        }

    }

    getProjectIdFromURL = async () => {
        const path = window.location.href;

        const projectId = path.split("/")[4];
        return projectId;
    }

    getConfigIdFromURL = async () => {
        const path = window.location.href;
        const configId = path.split("/")[6];
        return configId;
    }

    updateConfig = async () => {
        let parsedJSONData = {};
        try {
            parsedJSONData = JSON.parse(this.state.configJsonValue);
        } catch (e) {
            return;
        }

        if (this.state.projectId && this.state.configId) {
            let data = await RiskyApi.call(process.env.REACT_APP_API_ROOT_URL + "/projects/" + this.state.projectId + "/configs/" + this.state.configId, {
                method: 'PUT',
                body: JSON.stringify({ 
                    attributes: parsedJSONData
                }),
            })
        }
    }

    configChanged = async (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            "configJsonValue": event.target.value
        }, () => {
            this.updateConfig();
        })
    }

    render() {
        let parsedJSONData = {};
        try {
            parsedJSONData = JSON.parse(this.state.configJsonValue);
        } catch (e) {

        }


        return (
            <>
                <Grid container>
                    <Grid item xs={6}>
                        <Item>
                            Project Name Configuration
                            
                            <TextField multiline minRows={4} value={this.state.configJsonValue} onChange={this.configChanged} id="config-json-field" label="Outlined" variant="outlined" />
                        </Item>

                    </Grid>
                    <Grid item xs={6}>
                        <Item>
                        <JsonViewer
                            value={parsedJSONData}
                        />
                        </Item>
                    </Grid>

                </Grid>

            </>
        )
    }
}

export default ConfigEditorPage;
