import { Button, Grid, IconButton, Stack, TextField } from '@mui/material';
import React from 'react';
import Item from '@mui/material/Grid';
import { RiskyApi } from './api';


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

    componentDidMount(): void {
        this.getProjectIdFromURL();
        this.getConfigIdFromURL();
    }

    getProjectIdFromURL = async () => {
        const path = window.location.href;

        const projectId = path.split("/")[4];
        this.setState({
            projectId: projectId
        })
    }

    getConfigIdFromURL = async () => {
        const path = window.location.href;

        const configId = path.split("/")[6];
        this.setState({
            configId: configId
        })
    }

    updateConfig = async () => {
        let data = await RiskyApi.call("http://localhost:8000/projects/" + this.state.projectId + "/configs/" + this.state.configId, {
            method: 'PUT',
            body: JSON.stringify({ 
                attributes: JSON.parse(this.state.configJsonValue)
            }),
        })

        if (!data.ok) {
            console.error("Request failed")
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
                            A beautiful JSON viewer
                        </Item>
                    </Grid>

                </Grid>

            </>
        )
    }
}

export default ConfigEditorPage;
