import { useContext, useEffect, useState } from 'react';
import { MarketSate, SocketEventsService } from './SocketEventsService';
import { SocketEventsServiceContext } from './SocketEventsServiceProvider';

export const useMarketData = (marketUpdateBufferTime = 100) => {
  const service = useContext<SocketEventsService>(SocketEventsServiceContext);
  const [marketData, setMarketData] = useState<MarketSate>({ bids: [], asks: [] });

  useEffect(() => {
    if (!service) {
      return;
    }

    const marketUpdatesSubscription = service.marketData$.subscribe(value => setMarketData(value));
    return () => marketUpdatesSubscription.unsubscribe();
  }, [service]);

  useEffect(() => {
    if (service) {
      service.marketUpdateBufferTime = marketUpdateBufferTime;
    }
  }, [marketUpdateBufferTime, service]);

  return { marketData, service };
};
