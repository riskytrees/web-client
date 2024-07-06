import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import Item from '@mui/material/Grid';
import { RiskyApi } from './api';
import { JsonViewer } from '@textea/json-viewer';

class ConfigEditorPage extends React.Component<{
}, {
    configJsonValue: string;
    projectId: string | null;
    configId: string | null;
    addDialogOpen: boolean;
}> {
    constructor(props) {
        super(props);
        this.state = { configJsonValue: "", projectId: null, configId: null, addDialogOpen: false };

        this.configChanged = this.configChanged.bind(this);
        this.configAdd = this.configAdd.bind(this);
        this.configDelete = this.configDelete.bind(this);
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

    configChanged = async (path, oldVal, newVal) => {
        console.log(path)
        console.log(newVal)

        const newConfig = JSON.parse(this.state.configJsonValue);

        newConfig[path] = newVal;

        this.setState({
            "configJsonValue": JSON.stringify(newConfig)
        }, () => {
            this.updateConfig();
        })
    }

    configAdd = async (path) => {
        const newConfig = JSON.parse(this.state.configJsonValue);


        newConfig[path] = ''

        this.setState({
            "configJsonValue": JSON.stringify(newConfig)
        }, () => {
            this.updateConfig();
        })
    }

    configDelete = async (path) => {
        const newConfig = JSON.parse(this.state.configJsonValue);

        delete newConfig[path]

        this.setState({
            "configJsonValue": JSON.stringify(newConfig)
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
                <Dialog
                    open={this.state.addDialogOpen}
                    onClose={() => {
                        this.setState({
                            addDialogOpen: false
                        })
                    }}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const email = formJson.name;
                            this.configAdd([email]);
                            this.setState({
                                addDialogOpen: false
                            })
                        },
                    }}
                >
                    <DialogTitle>Name of field</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Key name of the field to add
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Name"
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.setState({
                                addDialogOpen: false
                            })
                        }}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </Dialog>


                <Grid container>
                    <Grid item xs={3}>
                        <Item>
                            <Typography overflow={"scroll"}>Configuration: {this.state.configId}</Typography>
                            

                        </Item>

                    </Grid>
                    <Grid item xs={7}>
                        <Item>
                            <JsonViewer
                                key={"jsonEditor"}
                                editable={true}
                                onChange={this.configChanged}
                                enableDelete={true}
                                onDelete={this.configDelete}
                                enableAdd={true}
                                onAdd={() => {
                                    this.setState({
                                        addDialogOpen: true
                                    })
                                }}
                                //enableAdd={true}
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
