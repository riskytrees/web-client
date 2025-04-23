import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Modal, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import Item from '@mui/material/Grid';
import { RiskyApi } from './api';
import { JsonViewer } from '@textea/json-viewer';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { baseComponents } from './App';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

class ConfigEditorPage extends React.Component<{
}, {
    configJsonValue: string;
    projectId: string | null;
    configId: string | null;
    configName: string | null;
    modalOpen: boolean;
    addDialogOpen: boolean;
}> {
    constructor(props) {
        super(props);
        this.state = {configJsonValue: "", projectId: null, configId: null, configName: null, modalOpen: false, addDialogOpen: false };

        this.configChanged = this.configChanged.bind(this);
        this.handleConfigNameChanged = this.handleConfigNameChanged.bind(this);

        this.handleClose = this.handleClose.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
    }

    getConfigName() {
        if (this.state.configName) {
            return this.state.configName;
        }

        return this.state.configId;
    }

    async handleBackClick() {
        window.history.back();
    }

    handleClose() {
        this.setState({
            modalOpen: false
        })
    }

    async handleConfigNameChanged(event) {
        const proposedName = event.target.value;

        this.setState({
            configName: proposedName
        }, () => {
            this.updateConfig()
        })

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
                "configJsonValue": JSON.stringify(data.result.attributes, null, "\t"),
                "configName": data.result.name
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
                    attributes: parsedJSONData,
                    name: this.state.configName
                }),
            })
        }
    }

    configChanged = async (event) => {

        try {
            const newConfig = JSON.parse(event.target.value);

            this.setState({
                "configJsonValue": event.target.value
            }, () => {
                this.updateConfig();
            })
        } catch (e) {
            return;
        }

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

                <AppBar>
                    <Grid container>
                        <Grid size={5} marginTop="10px" sx={{ maxWidth: "220px" }}><IconButton onClick={this.handleBackClick} >{<ArrowBackIcon />}</IconButton></Grid>
                        <Grid size={2} marginTop="5.75px" sx={{ maxWidth: "220px" }}>
                            <Stack alignContent="center" sx={{ maxWidth: "220px" }}>
                                <Button variant='inlineNavButton' onClick={() => {
                                    this.setState({
                                        modalOpen: true
                                    })
                                }} endIcon={<ArrowDropDownIcon />}>{this.getConfigName()}</Button>
                            </Stack>
                        </Grid>
                        <Grid size={5}></Grid>
                    </Grid>
                </AppBar>

                <Modal
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >

                    <Box className="treeSelectCenter">
                        <Stack direction="column" spacing={2} alignItems="right" justifyContent="center">
                            <TextField label="Config Name" variant="outlined" size="small" onChange={this.handleConfigNameChanged} defaultValue={this.getConfigName()} />

                        </Stack>
                    </Box>

                </Modal>

                <Grid container>
                    <Grid item xs={12}>
                        <Item>
                            <CodeEditor
                                data-color-mode="dark"
                                key={"jsonEditor"}
                                language="json"
                                onChange={this.configChanged}
                                padding={15}
                                value={this.state.configJsonValue}
                                style={{
                                    marginTop: baseComponents.MuiAppBar.styleOverrides.root.height,
                                    fontSize: 16,
                                    height: "calc(100vh" + " - " + baseComponents.MuiAppBar.styleOverrides.root.height + ")"
                                }}
                            >

                            </CodeEditor>
                        </Item>
                    </Grid>
                </Grid>

            </>
        )
    }
}

export default ConfigEditorPage;
