import HomePage from './HomePage';
import Projects from './Projects.tsx';
import TreeViewPage from './TreeViewPage';
import { RiskyColors } from './colors.ts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { createTheme, ThemeProvider }  from "@mui/material";
import { calculateNewValue } from '@testing-library/user-event/dist/utils';

const baseComponents = {
  MuiListSubheader: {
    styleOverrides: {
      root: {
        background: "transparent",
        fontSize: "24px"
      }
    } 
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        color: RiskyColors.uiColors.mainText,
      }
    }
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        padding: 0,
        backgroundColor: RiskyColors.uiColors.mainNodeBackground,
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        backgroundColor: RiskyColors.uiColors.buttonSecondary,
      }
    }
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

    },
}, {
  props: { variant: 'treearea' },
  style: {
    backgroundColor: RiskyColors.uiColors.mainBackground,
    height: 'calc(100vh)',
    width: '100%',
  },
}
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

