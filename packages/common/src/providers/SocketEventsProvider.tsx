import React from 'react';
import { MarketSate, SocketEventsService, useSocketEventsService } from './SocketEventsService';

const SocketEventsContext = React.createContext<{ marketData: MarketSate; service: SocketEventsService }>(null);

export const SocketEventsProvider = ({ children }) => {
  const { marketData, service } = useSocketEventsService('wss://www.cryptofacilities.com/ws/v1', 25, 1000);
  return <SocketEventsContext.Provider value={{ marketData, service }}>{children}</SocketEventsContext.Provider>;
};
