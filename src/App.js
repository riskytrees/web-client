import HomePage from './HomePage';
import Projects from './Projects.tsx';
import TreeViewPage from './TreeViewPage';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { createTheme, ThemeProvider }  from "@mui/material";

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
        color: "white"
      }
    }
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        padding: 0
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
      backgroundColor: 'rgb(42, 42, 42)',
      height: 'calc(100vh - 60px)',
      padding: '15px',
      width: '316px',
      marginTop: '60px',
    },
}
]
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        width: '100%',
        height: '60px',
        backgroundColor: 'rgb(48, 48, 48)',
        backgroundImage: 'none',
        boxShadow: '2px 2px 4px 0px rgb(5 5 5 / 10%)',

      },
},
  },
  MuiStack: {
    styleOverrides: {
      root: {
    

      },
},
  }
};

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: baseComponents
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
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
