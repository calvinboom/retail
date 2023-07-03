import React from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import theme from '../src/theme';
import routes from '../src/routes';

function App() {
  const token = localStorage.getItem('accessToken');
  const routing = useRoutes(routes(token));

  return (
    <ThemeProvider theme={theme}>
      {routing}
    </ThemeProvider>
  );
}

export default App;