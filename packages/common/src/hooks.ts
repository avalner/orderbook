import { useMemo } from 'react';

type MarketItemData = {
  price: number;
  size: number;
  total: number;
  totalPercent?: number;
};

export const useFullMarketData = (marketSideData: [number, number][], rowNum: number, group: number) => {
  return useMemo(() => {
    const result = marketSideData?.reduce<MarketItemData[]>((result, [price, size]) => {
      if (result.length === rowNum) {
        return result;
      }

      const prevItem = result[result.length - 1];
      const prevPrice = prevItem?.price || 0;

      // merge size with previous item if price difference is less then group
      if (Math.abs(price - prevPrice) < group) {
        prevItem.size += size;
        prevItem.total += size;
        return result;
      }

      const newItem = {
        price,
        size,
        total: (prevItem?.total || 0) + size,
      };
      result.push(newItem);
      return result;
    }, []);

    const grandTotal = result[result.length - 1]?.total;
    result.forEach(item => (item.totalPercent = (item.total / grandTotal) * 100));
    return result;
  }, [marketSideData, group, rowNum]);
};
