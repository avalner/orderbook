import styled from '@emotion/styled';
import Select, { NumericValueOption } from '../../shared/components/Select/Select';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../shared/components/Button/Button';
import { Icon } from '../../shared/components/Icon/Icon';
import { useTheme } from '@emotion/react';
import OrderTableContainer from './OrderTableContainer';
import {
  DEFAULT_PRODUCT,
  FEED_URL,
  MARKET_DEPTH,
  PRODUCT_GROUPS,
  PRODUCT,
  UPDATE_INTERVALS,
  PRODUCT_NAMES,
} from '@orderbook/common/constants';

const updateIntervalOptions: NumericValueOption[] = UPDATE_INTERVALS.map(value => ({ value, label: value.toString() }));

const Orderbook = () => {
  const theme = useTheme();
  const [selectedProduct, setSelectedProduct] = useState(DEFAULT_PRODUCT);
  const [updateInterval, setUpdateInternal] = useState(updateIntervalOptions[2]);

  const groupOptions: NumericValueOption[] = useMemo(() => {
    return PRODUCT_GROUPS[selectedProduct].map(value => ({
      value,
      label: value.toFixed(selectedProduct === PRODUCT.bitcoin ? 1 : 2),
    }));
  }, [selectedProduct]);

  useEffect(() => {
    setGroup(groupOptions[0]);
  }, [groupOptions]);

  const [group, setGroup] = useState(groupOptions[0]);

  const switchSelectedProduct = () => {
    if (selectedProduct === PRODUCT.bitcoin) {
      setSelectedProduct(PRODUCT.ethereum);
    } else {
      setSelectedProduct(PRODUCT.bitcoin);
    }
  };

  return (
    <Container>
      <Header>
        <span>Order Book</span>
        <ControlsContainer>
          <SelectedProduct>Selected Product: {PRODUCT_NAMES[selectedProduct]}</SelectedProduct>
          <Select value={group} selectedValuePrefix="Group" options={groupOptions} onChange={setGroup} />
          <Select
            value={updateInterval}
            selectedValuePrefix="Interval"
            options={updateIntervalOptions}
            onChange={setUpdateInternal}
          />
        </ControlsContainer>
      </Header>
      <Content>
        <OrderTableContainer
          feedUrl={FEED_URL}
          group={group.value}
          marketDepth={MARKET_DEPTH}
          selectedProduct={selectedProduct}
          updateInterval={updateInterval.value}
        />
      </Content>
      <Footer>
        <ButtonStyled color={theme.palette.color.purple} onClick={switchSelectedProduct}>
          <Icon icon="transfer" />
          Toggle Feed
        </ButtonStyled>
        <ButtonStyled color={theme.palette.color.red}>
          <Icon icon="warning" />
          Kill Feed
        </ButtonStyled>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 700px;
  height: 100%;
  padding: 4px;
  background-color: ${p => p.theme.palette.panelBackgroundColor};
`;

const ControlsContainer = styled.div`
  display: flex;
  & > *:not(:first-child) {
    margin-left: 10px;
  }
`;

const SelectedProduct = styled.span`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${p => p.theme.palette.monochrome.mediumdark};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-basis: 45px;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 0 20px;
  margin-bottom: 1px;
  background-color: ${p => p.theme.palette.mainBackgroundColor};
`;

const Content = styled.div`
  overflow: hidden;
  flex: 1 1 auto;
  background-color: ${p => p.theme.palette.mainBackgroundColor};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 60px;
  margin-top: 1px;

  & > button:not(:first-of-type) {
    margin-left: 10px;
  }
`;

const ButtonStyled = styled(Button)`
  width: 145px;
`;

export default Orderbook;
