import React from 'react';
import OrderbookTable from './OrderbookTable';
import {useSocketEventsService} from '@orderbook/common/providers/SocketEventsService';
import {useEffect} from 'react';

const OrderTableContainer: React.FC<{
  feedUrl: string;
  group: number;
  marketDepth: number;
  updateInterval: number;
  selectedProduct: string;
}> = ({
  feedUrl,
  group = 0.5,
  marketDepth = 100,
  updateInterval = 1000,
  selectedProduct,
}) => {
  const {marketData, service} = useSocketEventsService(
    feedUrl,
    marketDepth,
    updateInterval,
  );

  useEffect(() => {
    if (service?.subscribedProduct !== selectedProduct) {
      service?.subscribeToProduct(selectedProduct);
    }
  }, [service, selectedProduct]);

  return (
    <OrderbookTable
      bids={marketData.bids}
      asks={marketData.asks}
      group={group}
    />
  );
};

export default OrderTableContainer;
