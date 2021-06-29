import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import theme from '../theme';
import {useFullMarketData} from '@orderbook/common/hooks';
import {MarketSide} from '@orderbook/common/types';

const MarketSideTable: React.FC<{
  data: [number, number][];
  group: number;
  rowNum?: number;
  marketSide: MarketSide;
}> = ({data, group, rowNum = 10, marketSide}) => {
  const fullData = useFullMarketData(data, rowNum, group);

  return (
    <View
      style={{
        flexDirection: marketSide === 'bid' ? 'column' : 'column-reverse',
        flexGrow: 1,
      }}>
      {fullData.map((item, index) => (
        <View key={index} style={styles.row}>
          <View
            style={{
              ...(marketSide === 'bid'
                ? styles.totalBarBid
                : styles.totalBarAsk),
              left: 100 - item.totalPercent + '%',
            }}
          />
          <View style={styles.cellPrice}>
            <Text style={styles.totalCellInner}>
              {item.price.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </Text>
          </View>
          <View style={styles.cellSize}>
            <Text style={styles.dataCellInner}>
              {item.size.toLocaleString('en-US')}
            </Text>
          </View>
          <View style={styles.cellTotal}>
            <Text style={styles.dataCellInner}>
              {item.total.toLocaleString('en-US')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export const MarketSideTableHeader = () => (
  <View style={styles.headerRow}>
    <View style={styles.cellPrice}>
      <Text style={styles.headerCellInner}>Price</Text>
    </View>
    <View style={styles.cellSize}>
      <Text style={styles.headerCellInner}>Size</Text>
    </View>
    <View style={styles.cellTotal}>
      <Text style={styles.headerCellInner}>Total</Text>
    </View>
  </View>
);

const commonStyles = StyleSheet.create({
  cell: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '50%',
  },
  totalBar: {
    position: 'absolute',
    top: -1,
    right: 0,
    bottom: 1,
  },
});

const styles = StyleSheet.create({
  container: {},
  headerRow: {
    position: 'relative',
    flexDirection: 'row',
    flexBasis: 25,
  },
  row: {
    position: 'relative',
    flexDirection: 'row',
    flexGrow: 1,
  },
  cellPrice: {
    ...commonStyles.cell,
    width: '34%',
  },
  cellSize: {
    ...commonStyles.cell,
    width: '33%',
  },
  cellTotal: {
    ...commonStyles.cell,
    width: '33%',
  },
  headerCellInner: {
    ...commonStyles.cellInner,
    fontSize: 16,
    color: '#565d6b',
    textTransform: 'uppercase',
  },
  dataCellInner: {
    ...commonStyles.cellInner,
    fontSize: 14,
    color: '#fff',
  },
  totalCellInner: {
    ...commonStyles.cellInner,
    fontSize: 14,
    color: '#10B585',
  },
  totalBarBid: {
    ...commonStyles.totalBar,
    backgroundColor: theme.palette.buyColor,
  },
  totalBarAsk: {
    ...commonStyles.totalBar,
    backgroundColor: theme.palette.sellColor,
  },
});

export default MarketSideTable;
