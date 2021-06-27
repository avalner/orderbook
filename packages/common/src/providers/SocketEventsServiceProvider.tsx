import React, { useEffect, useState } from 'react';
import { SocketEventsService } from './SocketEventsService';
import { DEFAULT_FEED_BUFFER_TIME, FEED_URL, MARKET_DEPTH } from '../constants';

export const SocketEventsServiceContext = React.createContext<SocketEventsService>(null);

export const SocketEventsServiceProvider = ({ children }) => {
  const [service, setService] = useState<SocketEventsService>();

  useEffect(() => {
    const srv = new SocketEventsService(FEED_URL, MARKET_DEPTH, DEFAULT_FEED_BUFFER_TIME);
    console.log('SocketEventsService created');
    srv.open();
    setService(srv);
    return () => {
      srv?.close();
    };
  }, []);

  return <SocketEventsServiceContext.Provider value={service}>{children}</SocketEventsServiceContext.Provider>;
};
