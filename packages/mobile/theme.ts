import commonTheme from '@orderbook/common/theme';

const theme = {
  ...commonTheme,
  Text: {
    style: {
      color: commonTheme.palette.text.primary,
    },
  },
  Button: {
    buttonStyle: {
      minWidth: 150,
      paddingHorizontal: 15,
    },
  },
};

export default theme;
