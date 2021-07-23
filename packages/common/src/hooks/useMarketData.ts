import { useContext, useEffect, useState } from 'react';
import { MarketSate, SocketEventsService } from '../providers/SocketEventsService';
import { SocketEventsServiceContext } from '../providers/SocketEventsServiceProvider';
import { throttleTime } from 'rxjs/operators';
import { MARKET_DEPTH } from '../constants';

function sortAndTruncateMap(map: Map<number, number>, desc = false, size: number) {
  const sortedArray = Array.from(map.entries()).sort((item1, item2) =>
    desc ? item2[0] - item1[0] : item1[0] - item2[0],
  );

  return sortedArray.slice(0, size);
}

const useMarketData = (marketUpdateBufferTime = 100) => {
  const service = useContext<SocketEventsService>(SocketEventsServiceContext);
  const [marketData, setMarketData] = useState<MarketSate>({ bids: [], asks: [] });

  useEffect(() => {
    if (!service) {
      return;
    }

    const marketUpdatesSubscription = service.marketData$.pipe(throttleTime(marketUpdateBufferTime)).subscribe(value =>
      setMarketData({
        bids: sortAndTruncateMap(value.bids, true, MARKET_DEPTH),
        asks: sortAndTruncateMap(value.asks, false, MARKET_DEPTH),
      }),
    );
    return () => marketUpdatesSubscription.unsubscribe();
  }, [service, marketUpdateBufferTime]);

  return { marketData, service };
};

export default useMarketData;
