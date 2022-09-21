import HomePage from './HomePage';
import Projects from './Projects';
import TreeViewPage from './TreeViewPage';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { createTheme, ThemeProvider }  from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
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
    }
  }
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
