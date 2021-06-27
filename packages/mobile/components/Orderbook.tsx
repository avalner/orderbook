import React from 'react';
import {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import theme from '../theme';
import {Picker} from '@react-native-community/picker';
import {Button, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import OrderbookTableContainer from './OrderbookTableContainer';
import {
  DEFAULT_PRODUCT,
  FEED_URL,
  PRODUCT,
  PRODUCT_GROUPS,
} from '@orderbook/common/constants';

const Orderbook = () => {
  const [selectedProduct, setSelectedProduct] = useState(DEFAULT_PRODUCT);

  const groupOptions = useMemo(() => {
    return PRODUCT_GROUPS[selectedProduct].map(value => (
      <Picker.Item
        key={value}
        label={value.toFixed(selectedProduct === PRODUCT.bitcoin ? 1 : 2)}
        value={value}
      />
    ));
  }, [selectedProduct]);

  useEffect(() => {
    setGroup(PRODUCT_GROUPS[selectedProduct][0]);
  }, [groupOptions]);

  const [group, setGroup] = useState(PRODUCT_GROUPS[selectedProduct][0]);

  const switchSelectedProduct = () => {
    if (selectedProduct === PRODUCT.bitcoin) {
      setSelectedProduct(PRODUCT.ethereum);
    } else {
      setSelectedProduct(PRODUCT.bitcoin);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Order book</Text>
        <View style={styles.controls}>
          <Text style={styles.pickerLabel}>Group</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={group}
              onValueChange={setGroup}>
              {groupOptions}
            </Picker>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <OrderbookTableContainer
          feedUrl={FEED_URL}
          selectedProduct={selectedProduct}
          group={group}
          updateInterval={1000}
          marketDepth={30}
        />
      </View>
      <View style={styles.footer}>
        <Button
          icon={
            <Icon
              name="exchange"
              size={12}
              adjustsFontSizeToFit={true}
              color="white"
            />
          }
          title="Toggle Feed"
          buttonStyle={styles.toggleFeedButton}
          titleStyle={styles.buttonTitle}
          onPress={switchSelectedProduct}
        />
        <Button
          icon={
            <Icon
              name="exclamation-circle"
              size={12}
              adjustsFontSizeToFit={true}
              color="white"
            />
          }
          title="Toggle Feed"
          buttonStyle={styles.killFeedButton}
          titleStyle={styles.buttonTitle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: '100%',
    padding: 4,
    backgroundColor: theme.palette.panelBackgroundColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexBasis: 45,
    flexGrow: 0,
    flexShrink: 0,
    paddingVertical: 0,
    paddingHorizontal: 20,
    marginBottom: 1,
    backgroundColor: theme.palette.mainBackgroundColor,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    overflow: 'hidden',
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: theme.palette.mainBackgroundColor,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: 60,
    marginTop: 1,
  },
  toggleFeedButton: {
    backgroundColor: theme.palette.color.purple,
    paddingHorizontal: 15,
  },
  killFeedButton: {
    marginLeft: 10,
    backgroundColor: theme.palette.color.red,
    paddingHorizontal: 15,
  },
  buttonTitle: {
    paddingLeft: 5,
  },
  pickerLabel: {
    color: theme.palette.text.primary,
    marginRight: 5,
  },
  pickerContainer: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.palette.panelBackgroundColor,
    width: 100,
    height: 25,
    borderRadius: 4,
  },
  picker: {
    position: 'absolute',
    left: 0,
    top: -12,
    width: 100,
    color: theme.palette.text.primary,
  },
});

export default Orderbook;
