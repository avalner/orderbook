import { css, Global, ThemeProvider } from '@emotion/react';
import { DocsContainer as BaseContainer } from '@storybook/addon-docs/blocks';
import { themes } from '@storybook/theming';
import React from 'react';
import { useDarkMode } from 'storybook-dark-mode';
import darkTheme from '../../src/theme';

export const DocsContainer = ({ children, context }) => {
  const dark = useDarkMode();
  const theme = dark ? darkTheme : darkTheme;

  return (
    <>
      <Global styles={getGlobalStyle(theme)} />
      <ThemeProvider theme={theme}>
        <BaseContainer
          context={{
            ...context,
            parameters: {
              ...context.parameters,
              docs: {
                // This is where the magic happens.
                theme: dark ? themes.dark : themes.light,
              },
            },
          }}
        >
          {children}
        </BaseContainer>
      </ThemeProvider>
    </>
  );
};

const getGlobalStyle = theme => css`
  body {
    background-color: ${theme.palette.panelBackgroundColor};
  }
  p {
    margin: 0;
  }
`;
