import { css } from '@emotion/react';
import { theme as commonTheme } from '@orderbook/common/theme';

const theme = {
  ...commonTheme,
};

export type Theme = typeof theme;

export const globalStyle = css`
  html {
    height: 100%;
  }

  body {
    height: 100%;
    margin: 0;
    font-family: ${theme.typography.fontFamily};
    font-size: 16px;
    color: ${theme.palette.text.primary};
    background-color: ${theme.palette.mainBackgroundColor};
  }

  #root {
    height: 100%;
  }

  p {
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }
`;

export default theme;
