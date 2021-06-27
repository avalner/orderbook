import React from 'react';
import OrderbookTable from './OrderbookTable';
import {useEffect} from 'react';
import {useMarketData} from '@orderbook/common/providers/useMarketData';

const OrderTableContainer: React.FC<{
  group: number;
  updateInterval: number;
  selectedProduct: string;
}> = ({group = 0.5, updateInterval = 500, selectedProduct}) => {
  const {marketData, service} = useMarketData(updateInterval);

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
