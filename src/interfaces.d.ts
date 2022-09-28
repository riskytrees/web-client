import Paper from '@mui/material/Paper';

declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        riskypane: true;
        treearea: true;
    }
}

