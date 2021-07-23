import React, { useEffect, useState } from 'react';
import { SocketEventsService } from './SocketEventsService';
import { FEED_URL } from '../constants';

export const SocketEventsServiceContext = React.createContext<SocketEventsService>(null);

export const SocketEventsServiceProvider = ({ children }) => {
  const [service, setService] = useState<SocketEventsService>();

  useEffect(() => {
    const srv = new SocketEventsService(FEED_URL);
    console.log('SocketEventsService created');
    srv.open();
    setService(srv);
    return () => {
      srv?.close();
    };
  }, []);

  return <SocketEventsServiceContext.Provider value={service}>{children}</SocketEventsServiceContext.Provider>;
};
