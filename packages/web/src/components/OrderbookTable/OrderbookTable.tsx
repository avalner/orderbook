import React from 'react';
import styled from '@emotion/styled';
import MarketSideTable from './MarketSideTable';

const OrderbookTable: React.FC<{
  bids: [number, number][];
  asks: [number, number][];
  group: number;
}> = ({ bids, asks, group }) => {
  return (
    <Container>
      <MarketSideTable data={bids} group={group} marketSide="bid" />
      <MarketSideTable data={asks} group={group} marketSide="ask" />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: 500px;
`;

export default OrderbookTable;
