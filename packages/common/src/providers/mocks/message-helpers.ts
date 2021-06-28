import { MarketSnapshotMessage, RequestMessage, SubscriptionResultMessage } from '../SocketEventsService';
import { PRODUCT } from '../../constants';
import { marketSnapshotEth, marketSnapshotXbt } from './messages';

export const getSubscribeMessage = (product: string): RequestMessage => {
  return { event: 'subscribe', feed: 'book_ui_1', product_ids: [product] };
};

export const getSubscribedMessage = (product: string): SubscriptionResultMessage => {
  return { event: 'subscribed', feed: 'book_ui_1', product_ids: [product] };
};

export const getUnsubscribeMessage = (product: string): RequestMessage => {
  return { event: 'unsubscribe', feed: 'book_ui_1', product_ids: [product] };
};

export const getUnsubscribedMessage = (product: string): SubscriptionResultMessage => {
  return { event: 'unsubscribed', feed: 'book_ui_1', product_ids: [product] };
};

export const getMarketSnapshotMessage = (product: string): MarketSnapshotMessage => {
  return product === PRODUCT.BTC ? marketSnapshotXbt : marketSnapshotEth;
};
