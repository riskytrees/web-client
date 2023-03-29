import Paper from '@mui/material/Paper';

declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        riskypane: true;
        loginpane: true;
        treearea: true;
        homepane:true;
        loginback:true;
        loginBox:true;
    }
}
declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        addButton: true;
        deleteButton: true;
        primaryButton: true;
        createButton: true;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        h3: true;
        h2: true;
    }
}
