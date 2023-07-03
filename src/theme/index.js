import { createTheme } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

// const theme = createTheme({
//   palette: {
//     background: {
//       default: '#F4F6F8',
//       paper: colors.common.white
//     },
//     primary: {
//       contrastText: '#ffffff',
//       main: '#5664d2'
//     },
//     text: {
//       primary: '#172b4d',
//       secondary: '#6b778c'
//     }
//   },
//   shadows,
//   typography
// });
let theme_variable
if(process.env.REACT_APP_THEME === 'light'){
  theme_variable = {
    palette: {
      background: {
        default: '#F4F6F8',
        paper: colors.common.white
      },
      primary: {
        contrastText: '#ffffff',
        main: '#668fbe'
      },
      primaryButton: {
        contrastText: '#ffffff',
        main: '#d69d5f'
      },
      text: {
        primary: '#172b4d',
        secondary: '#6b778c'
      }
    },
      shadows,
      typography
    }
}
const theme = createTheme(theme_variable);

export default theme;
