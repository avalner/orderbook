import WS from 'jest-websocket-mock';
import { MarketSate, MarketUpdateMessage, SocketEventsService } from './SocketEventsService';
import {
  getMarketSnapshotMessage,
  getSubscribedMessage,
  getSubscribeMessage,
  getUnsubscribedMessage,
  getUnsubscribeMessage,
} from './mocks/message-helpers';
import { PRODUCT } from '../constants';
import { filter, skip, takeUntil, tap } from 'rxjs/operators';
import { marketDataAfterSnapshotXbt } from './mocks/messages';

const SERVER_URL = 'ws://localhost:1234';
const server: WS = new WS(SERVER_URL, { jsonProtocol: true });
let service: SocketEventsService;

beforeEach(() => {
  service = new SocketEventsService('ws://localhost:1234');
});

afterEach(() => {
  service.close();
});

test('Service.open test', done => {
  service.open();
  expect(service.opening).toBe(true);

  // assess service state after websocket is opened
  service.open$.subscribe(() => {
    expect(service.subscribing).toBe(false);
    expect(service.unsubscribing).toBe(false);
    expect(service.opening).toBe(false);
    expect(service.opened).toBe(true);
    expect(service.closing).toBe(false);
    expect(service.closed).toBe(false);
    expect(service.subscribedProduct).toBe(null);
    done();
  });
});

test('Product subscription test.', done => {
  service.open();
  service.open$.subscribe(async () => {
    service.subscribeToProduct(PRODUCT.BTC);
    await expect(server).toReceiveMessage(getSubscribeMessage(PRODUCT.BTC));
    // assess service state after product subscription is started
    expect(service.subscribing).toBe(true);
    expect(service.unsubscribing).toBe(false);
    expect(service.opening).toBe(false);
    expect(service.opened).toBe(true);
    expect(service.closing).toBe(false);
    expect(service.closed).toBe(false);
    expect(service.subscribedProduct).toBe(null);

    server.send(getSubscribedMessage(PRODUCT.BTC));

    // assess service state after subscription is finished
    service.subscribedToProduct$.pipe(filter(value => value)).subscribe(() => {
      expect(service.subscribing).toBe(false);
      expect(service.unsubscribing).toBe(false);
      expect(service.opening).toBe(false);
      expect(service.opened).toBe(true);
      expect(service.closing).toBe(false);
      expect(service.closed).toBe(false);
      expect(service.subscribedProduct).toBe(PRODUCT.BTC);
      done();
    });
  });
});

test('Product unsubscription test.', done => {
  service.open();
  service.open$.subscribe(async () => {
    service.subscribeToProduct(PRODUCT.BTC);
    await expect(server).toReceiveMessage(getSubscribeMessage(PRODUCT.BTC));
    server.send(getSubscribedMessage(PRODUCT.BTC));

    service.subscribedToProduct$.pipe(filter(value => value)).subscribe(async () => {
      service.unsubscribe();
      expect(service.subscribing).toBe(false);
      expect(service.unsubscribing).toBe(true);
      await expect(server).toReceiveMessage(getUnsubscribeMessage(PRODUCT.BTC));
      server.send(getUnsubscribedMessage(PRODUCT.BTC));

      // waiting for unsubscription
      service.subscribedToProduct$.pipe(filter(value => !value)).subscribe(() => {
        expect(service.subscribedProduct).toBe(null);
      });
      done();
    });
  });
});

test('Snapshot message test. Market update message data should be overridden by new snapshot data', done => {
  service.open();
  service.open$.subscribe(async () => {
    service.marketData$
      .pipe(
        tap(data => console.log(data)),
        takeUntil(service.closed$),
      )
      .subscribe(marketData => {
        expect({ bids: Array.from(marketData.bids), asks: Array.from(marketData.asks) }).toStrictEqual(
          marketDataAfterSnapshotXbt,
        );
      });

    service.subscribeToProduct(PRODUCT.BTC);
    server.send(getSubscribedMessage(PRODUCT.BTC));
    server.send(getMarketSnapshotMessage(PRODUCT.BTC));
    server.send({
      feed: 'book_ui_1',
      product_id: PRODUCT.BTC,
      bids: [[100, 100]],
      asks: [[90, 90]],
    } as MarketUpdateMessage);
    server.send(getMarketSnapshotMessage(PRODUCT.BTC));
    service.close();
  });
});

test('Market update message test', done => {
  service.open();
  service.open$.subscribe(async () => {
    service.subscribeToProduct(PRODUCT.BTC);
    server.send(getSubscribedMessage(PRODUCT.BTC));
    server.send({
      feed: 'book_ui_1',
      product_id: PRODUCT.BTC,
      bids: [[100, 100]],
      asks: [[90, 90]],
    } as MarketUpdateMessage);
    server.send({
      feed: 'book_ui_1',
      product_id: PRODUCT.BTC,
      bids: [
        [101, 200],
        [100, 50],
      ],
      asks: [
        [88, 70],
        [90, 80],
      ],
    } as MarketUpdateMessage);

    service.marketData$.pipe(skip(2)).subscribe(marketData => {
      service.open();
      expect(marketData).toStrictEqual({
        bids: [
          [101, 200],
          [100, 50],
        ],
        asks: [
          [88, 70],
          [90, 80],
        ],
      } as MarketSate);
      done();
    });
  });
});
