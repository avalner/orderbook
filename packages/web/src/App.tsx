import { Global, ThemeProvider } from '@emotion/react';
import Orderbook from './components/Orderbook/Orderbook';
import theme, { globalStyle } from './theme';
import { SocketEventsServiceProvider } from '@orderbook/common/providers/SocketEventsServiceProvider';
import { ToastContainer } from 'react-toastify';
import ErrorHandler from './components/ErrorHandler';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Global styles={globalStyle} />
      <ThemeProvider theme={theme}>
        <SocketEventsServiceProvider>
          <Orderbook />
          <ErrorHandler />
          <ToastContainer />
        </SocketEventsServiceProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
