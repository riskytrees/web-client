import React from 'react';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import AddUserButton from './AddUserButton';


class ProjectSidebar extends React.Component<{
}, {
    modalOpen: boolean;
}> {
    constructor(props) {
        super(props);
        this.state = { modalOpen: false };

        this.settingsClicked = this.settingsClicked.bind(this);
        this.treesClicked = this.treesClicked.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);

    }

    componentDidMount() {
    }

    handleOpen() {
        this.setState({ modalOpen: true })
    }

    handleClose() {
        this.setState({ modalOpen: false })
    }

    getOrgId() {
        const path = window.location.href;
        const orgId = path.split("/")[4];
        return orgId;
    }

    settingsClicked() {
        const path = window.location.href;
        const projectId = path.split("/")[4];

        window.location.href = "/projects/" + projectId + "/settings"
    }

    treesClicked() {
        const path = window.location.href;
        const projectId = path.split("/")[4];

        window.location.href = "/projects?id=" + projectId

    }

    render() {

        return (
            <>
                <Paper variant="riskypane">

                    <Box sx={{}}>
                    
                        <Button id="primaryButton" onClick={this.handleOpen} variant="primaryButton">New Project</Button>


                        <Modal
                            open={this.state.modalOpen}
                            onClose={this.handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >

                            <Box className="riskyModal">
                                <Typography variant="h2">Enter Member Email</Typography>
                                <Box height={"20px"}></Box>
                                <Stack direction="column" spacing={2} alignItems="right" justifyContent="center">
                                    <AddUserButton orgId={this.getOrgId()}></AddUserButton>
                                </Stack>
                            </Box>
                        </Modal>

                        <Box height={"10px"}></Box>
                        <nav aria-label="main mailbox folders">

                        </nav>
                        <Divider />
                        <nav aria-label="secondary mailbox folders">
                            <List>
                            <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemText primary="Trees" onClick={this.treesClicked} />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <ListItemText primary="Settings" onClick={this.settingsClicked} />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </nav>
                    </Box>

                </Paper>
            </>
        )
    }
}

export default ProjectSidebar;
