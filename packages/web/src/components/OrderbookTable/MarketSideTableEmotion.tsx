import React, { useMemo } from 'react';
import styled from '@emotion/styled';

export type MarketSide = 'bid' | 'ask';

type MarketItemData = {
  price: number;
  size: number;
  total: number;
  totalPercent?: number;
};

const MarketSideTableEmotion: React.FC<{
  data: [number, number][];
  marketSide: MarketSide;
}> = ({ data, marketSide }) => {
  const fullData: MarketItemData[] = useMemo(() => {
    const result = data?.reduce<MarketItemData[]>((result, [price, size]) => {
      const newItem = {
        price,
        size,
        total: (result[result.length - 1]?.total || 0) + size,
      };
      result.push(newItem);
      return result;
    }, []);

    const grandTotal = result[result.length - 1]?.total;
    result.forEach(item => (item.totalPercent = (item.total / grandTotal) * 100));
    return result;
  }, [data]);

  return (
    <Container>
      <HeaderRow marketSide={marketSide}>
        <HeaderCell size="40%">Total</HeaderCell>
        <HeaderCell size="30%">Size</HeaderCell>
        <HeaderCell size="30%">Price</HeaderCell>
      </HeaderRow>
      {fullData.map((item, index) => (
        <DataRow key={index} marketSide={marketSide}>
          <TotalBar
            style={{
              left: marketSide === 'bid' ? 100 - item.totalPercent + '%' : 0,
              right: marketSide === 'ask' ? 100 - item.totalPercent + '%' : 0,
            }}
            marketSide={marketSide}
          />
          <DataCell size="40%">{item.total.toLocaleString('en-US')}</DataCell>
          <DataCell size="30%">{item.size.toLocaleString('en-US')}</DataCell>
          <DataCell size="30%" color="#10B585">
            {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </DataCell>
        </DataRow>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 300px;
  min-height: 500px;
`;

const HeaderRow = styled.div<{ marketSide: MarketSide }>`
  display: flex;
  flex-direction: ${p => (p.marketSide === 'bid' ? 'row' : 'row-reverse')};
  height: 32px;
  min-height: 30px;
`;

const HeaderCell: React.FC<{ size: string; color?: string }> = ({ size, children }) => {
  return (
    <CellContainer size={size}>
      <HeaderCellInternal>{children}</HeaderCellInternal>
    </CellContainer>
  );
};

const HeaderCellInternal = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 60%;
  font-size: 16px;
  color: #565d6b;
  text-transform: uppercase;
`;

const DataRow = styled.div<{ marketSide: MarketSide }>`
  position: relative;
  display: flex;
  flex-direction: ${p => (p.marketSide === 'bid' ? 'row' : 'row-reverse')};
  height: 32px;
  min-height: 30px;
`;

const TotalBar = styled.div<{ marketSide: MarketSide }>`
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: ${p => (p.marketSide === 'bid' ? p.theme.palette.buyColor : p.theme.palette.sellColor)};
`;

const DataCell: React.FC<{ size: string; color?: string }> = ({ size, color, children }) => {
  return (
    <CellContainer size={size}>
      <DataCellInternal color={color}>{children}</DataCellInternal>
    </CellContainer>
  );
};

const CellContainer = styled.div<{ size: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${p => p.size};
`;

const DataCellInternal = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 60%;
  font-size: 14px;
  color: ${p => p.color || '#fff'};
  text-transform: uppercase;
`;

export default MarketSideTableEmotion;
