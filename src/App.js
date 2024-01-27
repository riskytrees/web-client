import HomePage from './HomePage';
import OrgHomePage from './OrgHomePage';
import OrgMembersPage from './OrgMembersPage';
import OrgSettingsPage from './OrgSettingsPage';

import Projects from './Projects.tsx';
import TreeViewPage from './TreeViewPage';
import LoginPage from './LoginPage';
import ConfigEditorPage from './ConfigEditorPage';

import { RiskyColors } from './colors.ts';
import { Variables } from './variables.ts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material";


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
        fontFamily: 'Open Sans',

      }
    },
    variants: [
      {
        props: { variant: 'h3' },
        style: {
          fontSize: '14px',
          fontWeight: '700',
        },
      },
      {
        props: { variant: 'body3' },
        style: {
          fontSize: '14px',
          color: RiskyColors.uiColors.secondaryText,
        },
      },
      {
        props: { variant: 'h1' },
        style: {
          fontSize: '24px',
          fontWeight: '700',
          color: RiskyColors.uiColors.mainText,
        },
      },
      {
        props: { variant: 'h2' },
        style: {
          fontSize: '16px',
          fontWeight: '500',
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
  MuiFormControl: {
    styleOverrides: {
      root: {
        borderRadius: '4px',
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
            borderColor: 'transparent',
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

        backgroundColor: 'none',

        borderRadius: '4px',
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
            borderColor: 'transparent',
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
          justifyContent: 'flex-start',
          paddingLeft: '10px',
          '&:hover': {
            backgroundColor: RiskyColors.uiColors.primaryCTA,
          },
        },
      }, {
        props: { variant: 'deleteButton' },
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          justifyContent: 'flex-start',
          paddingLeft: '10px',
          '&:hover': {
            backgroundColor: RiskyColors.uiColors.negative,
          },
        },
      }, {
        props: { variant: 'primaryButton' },
        style: {
          backgroundColor: RiskyColors.uiColors.primaryCTA,
          border: 'none',
          borderRadius: '16px',
          justifyContent: 'center',
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
          justifyContent: 'flex-center',
          '&:hover': {
            backgroundColor: RiskyColors.uiColors.primaryCTAhover,
          },
          '&:disabled': {
            backgroundColor: RiskyColors.uiColors.primaryCTAdisabled,
          }
        },
      },
      {
        props: { variant: 'inlineNavButton' },
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          justifyContent: 'flex-center',
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '&:disabled': {
            backgroundColor: 'transparent',
          }
        },
      },{
        props: { variant: 'backButton' },
        style: {
          backgroundColor: RiskyColors.uiColors.primaryCTA,
          border: 'none',
          justifyContent: 'flex-start',
          padding: '20px',
          height: '15px',
          '&:hover': {
            backgroundColor: RiskyColors.uiColors.primaryCTAhover,
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
        borderRadius: '4px',
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
            borderColor: 'transparent',
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
          marginTop: '50px',

        },
      },]
  },

  ListItemText: {
    styleOverrides: {
      root: {
        backgroundColor: 'none',

      },
    },
  },


  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '0px',


      },

    },
    variants: [
      {
        props: { variant: 'riskypane' },
        style: {
          backgroundColor: RiskyColors.uiColors.paneBackground,
          minHeight: 'calc(100vh - 60px)',
          height: 'inherit',
          padding: '15px',
          width: Variables.widthsList.paneWidth,
          overflow: 'auto',
          display: 'inline-block',
          overflowY: 'hidden',
          marginTop:'60px',
        },
      },
      {
        props: { variant: 'leftriskypane' },
        style: {
          backgroundColor: RiskyColors.uiColors.paneBackground,
          minHeight: 'calc(100vh - 90px)',
          zIndex: '1',
          position: 'absolute',
          padding: '15px',
          width: Variables.widthsList.paneWidth,
          overflow: 'auto',
          display: 'inline-block',
          overflowY: 'hidden',
        },
      },
      {
        props: { variant: 'rightriskypane' },
        style: {
          backgroundColor: RiskyColors.uiColors.paneBackground,
          minHeight: 'calc(100vh - 90px)',
          zIndex: '1',
          position: 'absolute',
          right: '0px',
          padding: '15px',
          width: Variables.widthsList.paneWidth,
          overflow: 'auto',
          display: 'inline-block',
          overflowY: 'hidden',
        },
      },
      {
        props: { variant: 'loginpane' },
        style: {
          backgroundColor: RiskyColors.uiColors.paneBackground,
          height: 'calc(100vh - 30px)',
          padding: '15px',
          width: Variables.widthsList.paneWidth,
          overflow: 'auto',
          display: 'inline-block',
          position: 'absolute',
          overflowY: 'hidden',
        },
      }, {
        props: { variant: 'treearea' },
        style: {
          backgroundColor: RiskyColors.uiColors.mainBackground,
          minHeight: 'calc(100vh)',
          height:'100%',
          width: '100%',
          marginTop: '60px',
        },
      },
      {
        props: { variant: 'loginback' },
        style: {

          height: 'calc(100vh)',
          width: '100%',
          margin: '0',
          background: 'linear-gradient(118.16deg, #020302 63.92%, #0A0B20 106.58%)',
        },
      },

      {
        props: { variant: 'loginlogo' },
        style: {

          height: '200px',
          width: 'calc(100% - ' + Variables.widthsList.paneWidth + ' - 200px)',
          position: 'absolute',
          display: 'inline',
          backgroundColor: 'transparent',
          margin: '0 auto',
          textAlign: 'center',
          top: '50%',

        },
      },
      {
        props: { variant: 'loginBox' },
        style: {
          height: 'calc(100vh)',
          width: 'calc(97vw - ' + Variables.widthsList.paneWidth + ' - 200px)',
          overflow: 'auto',

          display: 'inline-block',
          overflowY: 'hidden',
        },
      },
      {
        props: { variant: 'circle' },
        style: {
          borderRadius: '120px',
          overflow:'hidden',
        },
      },
    ]
  },

  MuiCard: {
    styleOverrides: {
      root: {


      }
    },
    variants: [
      {
        props: { variant: 'outlined' },
        style: {
          display:'flex-row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        },
      },]
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        width: '100%',
        height: '60px',
        backgroundColor: RiskyColors.uiColors.headerBackground,
        backgroundImage: 'none',
        boxShadow: '2px 2px 4px 0px rgb(5 5 5 / 10%)',
        position: 'fixed'
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
            <Route path="/orgs/:orgId" element={<OrgHomePage />}>
            </Route>
            <Route path="/orgs/:orgId/members" element={<OrgMembersPage />}>
            </Route>
            <Route path="/orgs/:orgId/settings" element={<OrgSettingsPage />}>
            </Route>
            <Route path="/projects" element={<Projects />}>
            </Route>
            <Route path="/projects/:projectId/config/:configId" element={<ConfigEditorPage />}>
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

