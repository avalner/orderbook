import styled from '@emotion/styled';
import Select, { NumericValueOption } from '../../shared/components/Select/Select';
import * as React from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '../../shared/components/Button/Button';
import { Icon } from '../../shared/components/Icon/Icon';
import { useTheme } from '@emotion/react';
import OrderTableContainer from './OrderTableContainer';
import { DEFAULT_PRODUCT, PRODUCT, PRODUCT_GROUPS, PRODUCT_NAMES, UPDATE_INTERVALS } from '@orderbook/common/constants';
import { SocketEventsServiceContext } from '@orderbook/common/providers/SocketEventsServiceProvider';

const updateIntervalOptions: NumericValueOption[] = UPDATE_INTERVALS.map(value => ({ value, label: value.toString() }));

const Orderbook = () => {
  const theme = useTheme();
  const socketService = useContext(SocketEventsServiceContext);
  const [selectedProduct, setSelectedProduct] = useState(DEFAULT_PRODUCT);
  const [updateInterval, setUpdateInternal] = useState(updateIntervalOptions[2]);
  const [killFeed, setKillFeed] = useState(true);

  const groupOptions: NumericValueOption[] = useMemo(() => {
    return PRODUCT_GROUPS[selectedProduct].map(value => ({
      value,
      label: value.toFixed(selectedProduct === PRODUCT.BTC ? 1 : 2),
    }));
  }, [selectedProduct]);

  useEffect(() => {
    setGroup(groupOptions[0]);
  }, [groupOptions]);

  const [group, setGroup] = useState(groupOptions[0]);

  const switchSelectedProduct = () => {
    if (selectedProduct === PRODUCT.BTC) {
      setSelectedProduct(PRODUCT.ETH);
    } else {
      setSelectedProduct(PRODUCT.BTC);
    }
  };

  const killFeedHandler = () => {
    killFeed ? socketService.simulateError() : socketService.open();
    setKillFeed(!killFeed);
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
          group={group.value}
          selectedProduct={selectedProduct}
          updateInterval={updateInterval.value}
        />
      </Content>
      <Footer>
        <ButtonStyled color={theme.palette.color.purple} disabled={!killFeed} onClick={switchSelectedProduct}>
          <Icon icon="transfer" />
          Toggle Feed
        </ButtonStyled>
        <ButtonStyled color={killFeed ? theme.palette.color.red : theme.palette.color.green} onClick={killFeedHandler}>
          <Icon icon="warning" />
          {killFeed ? 'Kill Feed' : 'Revive Feed'}
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
  & > * {
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
