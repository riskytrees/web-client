import HomePage from './HomePage';
import Projects from './Projects.tsx';
import TreeViewPage from './TreeViewPage';
import LoginPage from './LoginPage';
import { RiskyColors } from './colors.ts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginBackground from './img/login_background.png';
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
    },
    {
      props: { variant: 'h2' },
      style: {
        fontSize:'16px',
        fontWeight:'500',
        color: RiskyColors.uiColors.mainText,
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
          backgroundColor: RiskyColors.uiColors.primaryCTA,
          border: 'none',
          borderRadius:'16px',
          justifyContent:'flex-start',
          paddingLeft: '15px',
          paddingRight: '15px',
          '&:hover': {
            backgroundColor: RiskyColors.uiColors.primaryCTAhover,
        },
        },
        },
        {
          props: { variant: 'createButton' },
          style: {
            backgroundColor: RiskyColors.uiColors.primaryCTA,
            border: 'none',
            justifyContent:'flex-center',
            '&:hover': {
              backgroundColor: RiskyColors.uiColors.primaryCTAhover,
          },
            '&:disabled':{
              backgroundColor: RiskyColors.uiColors.primaryCTAdisabled,
            }
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
          height: 'calc(100vh - 30px)',
          padding: '15px',
          width: '316px',
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
    {
      props: { variant: 'loginback' },
      style: {

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
        position: 'relative'
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
          <Route path="/login" element={<LoginPage />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

    </>
  );
}

export default App;

