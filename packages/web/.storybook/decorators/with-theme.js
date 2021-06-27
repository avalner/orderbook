import React from 'react';
import { ThemeProvider, Global } from '@emotion/react';
import theme, { globalStyle } from '../../src/theme';

export default storyFn => (
  <>
    <Global styles={globalStyle} />
    <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
  </>
);
