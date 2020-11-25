import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#1e1f2e',
      main: '#2b2d42',
      dark: '#555767',
      contrastText: '#fff',
    },
    secondary: {
      light: '#a7182a',
      main: '#ef233c',
      dark: '#f24f63',
      contrastText: '#000',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          outline: 0,
        },
        html: {
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
          scrollBehavior: 'smooth',
        },
        'body, #root': {
          height: '100vh',
          backgroundColor: '#f7f9fa',
        },
        'body, input, button': {
          fontFamily: 'Kumbh Sans, sans-serif',
          textRendering: 'optimizelegibility',
        },
      },
    },
  },
});

export default theme;
