import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#43BABE',
    },
  },
  typography: {
    fontFamily: 'Open Sans, Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightBold: 700,
    h1: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontWeight: 700,
    },
    body1: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'Open Sans, Arial, sans-serif',
      fontWeight: 400,
    },
  },
});

export default theme;
