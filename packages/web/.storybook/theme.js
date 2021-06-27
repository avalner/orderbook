import { create } from '@storybook/theming/create';
import logo from '../src/assets/img/logo512.png';
import theme from '../src/theme';

const mainBackgroundColor = theme.palette.mainBackgroundColor;
const panelBackgroundColor = theme.palette.panelBackgroundColor;
const primaryColor = theme.palette.primary;
const textColor = theme.palette.text.primary;
const textColorInverse = panelBackgroundColor;
const fontFamily = theme.typography.fontFamily;

export default create({
  base: 'dark',

  colorPrimary: primaryColor,
  colorSecondary: primaryColor,

  // UI
  appBg: panelBackgroundColor,
  appContentBg: mainBackgroundColor,
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: fontFamily,

  // Text colors
  textColor: textColor,
  textInverseColor: textColorInverse,

  // Toolbar default and active colors
  barTextColor: textColor,
  barSelectedColor: textColor,
  barBg: panelBackgroundColor,

  // Form colors
  inputBg: panelBackgroundColor,
  inputBorder: '#808ba3',
  inputTextColor: textColor,
  inputBorderRadius: 4,

  brandTitle: 'Orderbook',
  brandUrl: 'http://example.com/',
  brandImage: logo,
});
