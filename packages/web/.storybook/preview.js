
import { addDecorator } from '@storybook/react';
import customTheme from './theme';
import withTheme from './decorators/with-theme';

// or global addParameters
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  docs: {
    theme: customTheme,
  },
  backgrounds: {
    disable: true,
  },
  viewport: {
    disable: true,
  },
};

addDecorator(withTheme);

