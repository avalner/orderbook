import {theme as commonTheme} from '@orderbook/common/theme';

const theme = {
  ...commonTheme,
  Text: {
    style: {
      color: commonTheme.palette.text.primary,
    },
  },
  Button: {
    buttonStyle: {
      paddingHorizontal: 15,
    },
  },
};

export default theme;
