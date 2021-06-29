import { useContext, useEffect } from 'react';
import { SocketEventsServiceContext } from '@orderbook/common/providers/SocketEventsServiceProvider';
import { toast } from 'react-toastify';
import { WebsocketEvent } from '@orderbook/common/types';

function getErrorMessageByType(type: string) {
  if (!window.navigator.onLine) {
    return 'There is no active internet connection available';
  }

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
      socketService.errors$.subscribe((error: WebsocketEvent) => {
        toast(getErrorMessageByType(error.type), {
          toastId: error.type,
          type: 'error',
          position: 'top-center',
          autoClose: false,
        });
      });

      socketService.open$.subscribe(open => {
        if (open) {
          toast.dismiss();
        }
      });
    }
  }, [socketService]);

  return null;
};

export default ErrorHandler;
