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
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';


class OrgSidebar extends React.Component<{
}, {
    modalOpen: boolean;
}> {
    constructor(props) {
        super(props);
        this.state = { modalOpen: false };

        this.teamMembersClicked = this.teamMembersClicked.bind(this);
        this.settingsClicked = this.settingsClicked.bind(this);
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

    teamMembersClicked() {
        const path = window.location.href;
        const orgId = path.split("/")[4];

        window.location.href = "/orgs/" + orgId + "/members"
    }

    settingsClicked() {
        const path = window.location.href;
        const orgId = path.split("/")[4];

        window.location.href = "/orgs/" + orgId + "/settings"
    }

    render() {

        return (
            <>
                <Paper variant="riskypane">

                    <Box sx={{}}>
                    <Box height={"12px"}></Box>
                        <Button id="primaryButton" onClick={this.handleOpen} startIcon={<AddIcon />} variant="primaryButton">New Project</Button>


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
                                    <ListItemButton >
                                    <SettingsIcon /><Box width={"5px"}></Box><ListItemText  primary="Org Settings" onClick={this.settingsClicked} />
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

export default OrgSidebar;
