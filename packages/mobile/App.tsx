import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import theme from './theme';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Orderbook from './components/Orderbook';
import {ThemeProvider} from 'react-native-elements';
import {SocketEventsServiceProvider} from '@orderbook/common/providers/SocketEventsServiceProvider';
import ErrorHandler from './components/ErrorHandler';
import Toast from 'react-native-toast-message';

const App = () => {
  const backgroundStyle = {
    backgroundColor: theme.palette.mainBackgroundColor,
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.palette.panelBackgroundColor}
        />
        <ThemeProvider theme={theme}>
          <SocketEventsServiceProvider>
            <Orderbook />
            <ErrorHandler />
            <Toast ref={ref => Toast.setRef(ref)} />
          </SocketEventsServiceProvider>
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
