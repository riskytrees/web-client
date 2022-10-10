import Paper from '@mui/material/Paper';

declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        riskypane: true;
        treearea: true;
    }
}
declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        addButton: true;
        deleteButton: true;
        primaryButton: true;
    }
}
