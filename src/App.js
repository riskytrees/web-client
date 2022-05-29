import HomePage from './HomePage';
import Projects from './Projects';
import TreeViewPage from './TreeViewPage';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
