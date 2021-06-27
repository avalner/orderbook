import React from 'react';
import {StyleSheet, View} from 'react-native';
import MarketSideTable, {MarketSideTableHeader} from './MarketSideTable';

const OrderbookTable: React.FC<{
  bids: [number, number][];
  asks: [number, number][];
  group: number;
}> = ({bids, asks, group}) => {
  return (
    <View style={styles.grow}>
      <MarketSideTableHeader />
      <View style={styles.grow}>
        <MarketSideTable data={asks} group={group} marketSide="ask" />
        <View style={styles.divider} />
        <MarketSideTable data={bids} group={group} marketSide="bid" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grow: {
    flexGrow: 1,
  },
  divider: {
    height: 20,
  },
});

export default OrderbookTable;
