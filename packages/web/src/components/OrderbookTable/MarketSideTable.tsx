import useFullMarketData from '@orderbook/common/hooks/useFullMarketData';
import { MarketSide } from '@orderbook/common/types';
import classNames from 'classnames/bind';
import React from 'react';
import styles from './MarketSideTable.module.css';

const cx = classNames.bind(styles);

const MarketSideTable: React.FC<{
  data: [number, number][];
  group: number;
  rowNum?: number;
  marketSide: MarketSide;
}> = ({ data, group, rowNum = 30, marketSide }) => {
  const fullData = useFullMarketData(data, rowNum, group);
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
