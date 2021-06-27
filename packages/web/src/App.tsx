import { Global, ThemeProvider } from '@emotion/react';
import Orderbook from './components/Orderbook/Orderbook';
import theme, { globalStyle } from './theme';

function App() {
  return (
    <>
      <Global styles={globalStyle} />
      <ThemeProvider theme={theme}>
        <Orderbook />
      </ThemeProvider>
    </>
  );
}

export default App;
