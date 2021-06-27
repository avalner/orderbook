import theme from './theme';
import '@emotion/react';

declare module '@emotion/react' {
  type EmotionTheme = typeof theme;
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends EmotionTheme {}
}
