import Paper from '@mui/material/Paper';

declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        riskypane: true;
        loginpane: true;
        treearea: true;
        homepane:true;
        loginback:true;
        loginBox:true;
        circle:true;
    }
}
declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        addButton: true;
        deleteButton: true;
        primaryButton: true;
        createButton: true;
        inlineNavButton: true;
        backButton: true;
    }
}

declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        h3: true;
        h2: true;
        body3:true;
    }
}
