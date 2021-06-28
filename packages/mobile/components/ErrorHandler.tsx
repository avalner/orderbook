import {useContext, useEffect} from 'react';
import {SocketEventsServiceContext} from '@orderbook/common/providers/SocketEventsServiceProvider';
import Toast from 'react-native-toast-message';

function getErrorMessageByType(type: string) {
  switch (type) {
    case 'close':
      return 'Connection is closed. Pleas check that you are still connected to the internet';
    case 'kill':
      return 'The feed was killed! Press "Revive Feed" button to fix it.';
    default: {
      return 'Unknown error has occurred.';
    }
  }
}

const ErrorHandler = () => {
  const socketService = useContext(SocketEventsServiceContext);

  useEffect(() => {
    if (socketService) {
      socketService.errors$.subscribe((error: any) => {
        Toast.show({
          text1: 'Error',
          text2: getErrorMessageByType(error.type),
          type: 'error',
          autoHide: false,
        });
      });

      socketService.open$.subscribe(open => {
        if (open) {
          Toast.hide();
        }
      });
    }
  }, [socketService]);

  return null;
};

export default ErrorHandler;
