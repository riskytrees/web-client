import HomePage from './HomePage';
import Projects from './Projects.tsx';
import TreeViewPage from './TreeViewPage';
import { RiskyColors } from './colors.ts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { createTheme, ThemeProvider }  from "@mui/material";
import { NoEncryption } from '@mui/icons-material';

const baseComponents = {

  MuiListSubheader: {
    styleOverrides: {
      root: {
        background: "transparent",
        fontSize: "24px",
        fontFamily: 'Open Sans, Sans-Serif',
      }
    } 
  },

  MuiTypography: {
    styleOverrides: {
      root: {
        fontFamily:'Open Sans',
      
      }
    },
    variants: [
      {
        props: { variant: 'h3' },
        style: {
          fontSize:'14px',
          fontWeight:'700',
        },
    },]
  },

  MuiModal: {
    styleOverrides: {
      root: {

        
      }
    }
  },
  MuiFormControl:{
    styleOverrides: {
      root: {
        borderRadius:'4px',
        '& label': {
          color: RiskyColors.uiColors.mainHighlightBorder,
        },
        '& label.Mui-focused': {
          color: RiskyColors.uiColors.mainHighlightBorder,
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: RiskyColors.uiColors.mainHighlightBorder,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor:'transparent',
          },
          '&:hover fieldset': {
            borderColor: RiskyColors.uiColors.mainHighlightBorder,
 
          },
          '&.Mui-focused fieldset': {
            borderColor: RiskyColors.uiColors.mainHighlightBorder,
          },
        },
      }
    }
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        padding: 0,

        backgroundColor:'none',

        borderRadius:'4px',
        '& label': {
          color: RiskyColors.uiColors.mainHighlightBorder,
        },
        '& label.Mui-focused': {
          color: RiskyColors.uiColors.mainHighlightBorder,
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: RiskyColors.uiColors.mainHighlightBorder,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor:'transparent',
          },
          '&:hover fieldset': {
            borderColor: RiskyColors.uiColors.mainHighlightBorder,
 
          },
          '&.Mui-focused fieldset': {
            borderColor: RiskyColors.uiColors.mainHighlightBorder,
          },
        },
      },

    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        backgroundColor: RiskyColors.uiColors.buttonSecondary,
        color: RiskyColors.uiColors.mainText,
      }
    },
    variants: [
      {
        props: { variant: 'addButton' },
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          justifyContent:'flex-start',
          paddingLeft: '10px',
          '&:hover': {
            backgroundColor: RiskyColors.uiColors.primaryCTA,
        },
        },
      },{
        props: { variant: 'deleteButton' },
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          justifyContent:'flex-start',
          paddingLeft: '10px',
          '&:hover': {
            backgroundColor: RiskyColors.uiColors.negative,
        },
        },
      },{
        props: { variant: 'primaryButton' },
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          justifyContent:'flex-start',
          paddingLeft: '10px',
          '&:hover': {
            backgroundColor: RiskyColors.uiColors.primaryButton,
        },
        },
        },
    ]
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        backgroundColor: RiskyColors.uiColors.buttonSecondary,
        fontFamily: 'Open Sans',
        borderRadius:'4px',
        '& label': {
          color: RiskyColors.uiColors.mainHighlightBorder,
        },
        '& label.Mui-focused': {
          color: RiskyColors.uiColors.mainHighlightBorder,
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: RiskyColors.uiColors.mainHighlightBorder,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor:'transparent',
          },
          '&:hover fieldset': {
            borderColor: RiskyColors.uiColors.mainHighlightBorder,
 
          },
          '&.Mui-focused fieldset': {
            borderColor: RiskyColors.uiColors.mainHighlightBorder,
          },
        },

      },

    },
    variants: [
      {
        props: { variant: 'outlined' },
        style: {

        },
    },]
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        backgroundColor: RiskyColors.uiColors.buttonSecondary,
        fontFamily: 'Open Sans, sans-serif',
        
      }
    },
    variants: [
      {
        props: { variant: 'outlined' },
        style: {
          
        },
        props: { variant: 'treeSelect' },
        style: {
          marginTop:'50px',
          
        },
    },]
  },

  List: {
    styleOverrides: {
      root: {
        backgroundColor:'red',

      },
    },
},
 ListItemButton: {
    styleOverrides: {
      root: {
        backgroundColor:'red',

      },
    },
},
ListItemText: {
  styleOverrides: {
    root: {
      backgroundColor:'none',

    },
  },
},
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius:'0px',


      },

},
variants: [
 
  {
    props: { variant: 'riskypane' },
    style: {
      backgroundColor: RiskyColors.uiColors.paneBackground,
      height: 'calc(100vh - 90px)',
      padding: '15px',
      width: '316px',
      marginTop: '60px',
      overflow: 'auto',

    },
}, {
  props: { variant: 'treearea' },
  style: {
    backgroundColor: RiskyColors.uiColors.mainBackground,
    height: 'calc(100vh)',
    width: '100%',
  },
}, 
]
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        width: '100%',
        height: '60px',
        backgroundColor: RiskyColors.uiColors.headerBackground,
        backgroundImage: 'none',
        boxShadow: '2px 2px 4px 0px rgb(5 5 5 / 10%)',

      },
},

  },

};

const theme = createTheme({

  palette: {
    mode: 'dark',


  },
  typography: {
    fontFamily: 'Open Sans',
  },
  components: baseComponents
  
});

function App() {
  return (
    <>
    <ThemeProvider theme={theme} >

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}>
          </Route>
          <Route path="/projects" element={<Projects />}>
          </Route>
          <Route path="/tree" element={<TreeViewPage />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

    </>
  );
}

export default App;

