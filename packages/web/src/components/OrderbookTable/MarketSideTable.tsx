import React, { useMemo } from 'react';
import styles from './MarketSideTable.module.css';
import classNames from 'classnames/bind';

export type MarketSide = 'bid' | 'ask';

type MarketItemData = {
  price: number;
  size: number;
  total: number;
  totalPercent?: number;
};

const cx = classNames.bind(styles);

const MarketSideTable: React.FC<{
  data: [number, number][];
  group: number;
  rowNum?: number;
  marketSide: MarketSide;
}> = ({ data, group, rowNum = 30, marketSide }) => {
  const fullData: MarketItemData[] = useMemo(() => {
    const result = data?.reduce<MarketItemData[]>((result, [price, size]) => {
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
  }, [data, group, rowNum]);

  return (
    <div className={styles.container}>
      <div className={cx('row', { rowBid: marketSide === 'bid', rowAsk: marketSide === 'ask' })}>
        <div className={cx('cell', 'cellTotal')}>
          <div className={cx('cellInner', 'headerCellInner')}>Total</div>
        </div>
        <div className={cx('cell', 'cellSize')}>
          <div className={cx('cellInner', 'headerCellInner')}>Size</div>
        </div>
        <div className={cx('cell', 'cellPrice')}>
          <div className={cx('cellInner', 'headerCellInner')}>Price</div>
        </div>
      </div>
      {fullData.map((item, index) => (
        <div key={index} className={cx('row', { rowBid: marketSide === 'bid', rowAsk: marketSide === 'ask' })}>
          <div
            className={cx('totalBar', { bidBgColor: marketSide === 'bid', askBgColor: marketSide === 'ask' })}
            style={{
              left: marketSide === 'bid' ? 100 - item.totalPercent + '%' : 0,
              right: marketSide === 'ask' ? 100 - item.totalPercent + '%' : 0,
            }}
          />
          <div className={cx('cell', 'cellTotal')}>
            <div className={cx('cellInner', 'dataCellInner')}>{item.total.toLocaleString('en-US')}</div>
          </div>
          <div className={cx('cell', 'cellSize')}>
            <div className={cx('cellInner', 'dataCellInner')}>{item.size.toLocaleString('en-US')}</div>
          </div>
          <div className={cx('cell', 'cellPrice')}>
            <div className={cx('cellInner', 'dataCellInner', 'dataCellInnerTotal')}>
              {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketSideTable;
