import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

import AppProvider from './hooks';

import Routes from './routes';

import theme from './styles/theme';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes />
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
