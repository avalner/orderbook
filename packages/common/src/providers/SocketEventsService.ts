import { bufferWhen, filter } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { useEffect, useState } from 'react';

export type RequestMessage = {
  event: 'subscribe' | 'unsubscribe';
  feed: 'book_ui_1';
  product_ids: string[];
};

export type SubscriptionResultMessage = {
  event: 'subscribed' | 'unsubscribed';
  feed: 'book_ui_1';
  product_ids: string[];
};

export type InfoMessage = {
  event: 'info';
  version: number;
};

export type AlertMessage = {
  event: 'alert';
  message: string;
};

export type MarketItem = [price: number, size: number];

export type MarketSnapshotMessage = {
  numLevels: number;
  feed: 'book_ui_1_snapshot';
  product_id: string;
  bids: MarketItem[];
  asks: MarketItem[];
};

export type MarketUpdateMessage = {
  feed: 'book_ui_1';
  product_id: string;
  bids: MarketItem[];
  asks: MarketItem[];
};

export type Message =
  | RequestMessage
  | InfoMessage
  | AlertMessage
  | SubscriptionResultMessage
  | MarketSnapshotMessage
  | MarketUpdateMessage;

export type MarketSate = {
  bids: [number, number][];
  asks: [number, number][];
};

function isSubscriptionResultMessage(message: Message): message is SubscriptionResultMessage {
  return 'event' in message && (message.event === 'subscribed' || message.event === 'unsubscribed');
}

function isInfoMessage(message: Message): message is InfoMessage {
  return 'event' in message && message.event === 'info';
}

function isAlertMessage(message: Message): message is AlertMessage {
  return 'event' in message && message.event === 'alert';
}

function isMarketSnapshotMessage(message: Message): message is MarketSnapshotMessage {
  return 'numLevels' in message && message.feed === 'book_ui_1_snapshot';
}

function isNonMarketUpdateMessage(message: Message): message is Exclude<Message, MarketUpdateMessage> {
  return !isMarketUpdateMessage(message);
}

function isMarketUpdateMessage(message: Message): message is MarketUpdateMessage {
  return (
    ('bids' in message || 'asks' in message) &&
    'product_id' in message &&
    message.feed === 'book_ui_1' &&
    !('numLevels' in message) &&
    !('event' in message)
  );
}

function sortAndTruncateMap(map: Map<number, number>, desc = false, size: number) {
  const sortedArray = Array.from(map.entries()).sort((item1, item2) =>
    desc ? item2[0] - item1[0] : item1[0] - item2[0],
  );

  return new Map<number, number>(sortedArray.slice(0, size));
}

export class SocketEventsService {
  private _subscribedProduct: string;
  private _webSocket: WebSocketSubject<Message>;
  private _openObserver = new Subject();
  private _closeObserver = new Subject();
  private _closingObserver = new Subject();
  private _subscribing: boolean;
  private _unsubscribing: boolean;
  private _opening: boolean;
  private _opened: boolean;
  private _closing: boolean;
  private _nonBufferedMessages$: Observable<Message>;
  private _bufferedMessages$: Observable<MarketUpdateMessage[]>;
  private _marketDataUpdated$ = new BehaviorSubject<MarketSate>({
    bids: [],
    asks: [],
  });
  private _bids = new Map<number, number>();
  private _asks = new Map<number, number>();

  get subscribedProduct() {
    return this._subscribedProduct;
  }

  get opened() {
    return this._opened;
  }

  get marketDataUpdated$() {
    return this._marketDataUpdated$;
  }

  constructor(public readonly url: string, private marketDepth: number, public marketUpdateBufferTime: number) {
    this._webSocket = webSocket({
      url: this.url,
      openObserver: this._openObserver,
      closeObserver: this._closeObserver,
      closingObserver: this._closingObserver,
    });

    this._openObserver.subscribe(() => (this._opened = true));
    this._closeObserver.subscribe(() => {
      this._opened = false;
      this._closing = false;
    });
    this._closingObserver.subscribe(() => (this._closing = true));

    this._nonBufferedMessages$ = this._webSocket.pipe(filter(message => isNonMarketUpdateMessage(message)));
    this._bufferedMessages$ = this._webSocket.pipe(filter(message => isMarketUpdateMessage(message))).pipe(
      bufferWhen(() => timer(this.marketUpdateBufferTime)),
      filter(messages => !!messages.length),
    ) as Observable<MarketUpdateMessage[]>;
  }

  open() {
    if (this._opening || this._opened) {
      throw new Error('Socket is already opening/opened.');
    }

    this._opening = true;

    this._nonBufferedMessages$.subscribe(message => {
      if (isMarketSnapshotMessage(message)) {
        this.processSnapshotMessage(message);
      } else if (isSubscriptionResultMessage(message)) {
        this.processSubscriptionMessage(message);
      } else if (isInfoMessage(message)) {
        this.processInfoMessage(message);
      } else if (isAlertMessage(message)) {
        this.processAlertMessage(message);
      }
    });

    this._bufferedMessages$.subscribe(messages => {
      this.processMarketUpdateMessage(messages);
    });
  }

  close() {
    if (this._closing || !this._opened) {
      throw new Error('Socket is already closed');
    }

    this._closing = true;
    this._opened = false;
    this._webSocket.complete();
  }

  subscribeToProduct(product: string) {
    if (this._subscribedProduct == product) {
      throw Error('There is already an active subscription to the product ' + product);
    }

    if (this._subscribedProduct) {
      this.unsubscribe();
    }

    this._subscribing = true;
    this._webSocket.next({ event: 'subscribe', feed: 'book_ui_1', product_ids: [product] } as RequestMessage);
  }

  unsubscribe() {
    if (!this._subscribedProduct) {
      throw new Error('There is no subscribed product');
    }

    this._unsubscribing = true;

    this._webSocket.next({
      event: 'unsubscribe',
      feed: 'book_ui_1',
      product_ids: [this._subscribedProduct],
    } as RequestMessage);
  }

  sendBadRequest() {
    this._webSocket.next({ event: 'bad event' as unknown, feed: 'book_ui_1', product_ids: [] } as RequestMessage);
  }

  private processMarketUpdateMessage(messages: MarketUpdateMessage[]) {
    const bids = this._bids;
    const asks = this._asks;

    messages.forEach((message: MarketUpdateMessage) => {
      message.bids?.forEach(bid => {
        if (bid[1] === 0) {
          bids.delete(bid[0]);
        } else {
          bids.set(bid[0], bid[1]);
        }
      });

      message.asks?.forEach(ask => {
        if (ask[1] === 0) {
          asks.delete(ask[0]);
        } else {
          asks.set(ask[0], ask[1]);
        }
      });
    });

    this._bids = sortAndTruncateMap(bids, true, this.marketDepth);
    this._asks = sortAndTruncateMap(asks, false, this.marketDepth);
    this._marketDataUpdated$.next({ bids: Array.from(this._bids), asks: Array.from(this._asks) });
  }

  private processSnapshotMessage(message: MarketSnapshotMessage) {
    this._bids = sortAndTruncateMap(new Map<number, number>(message.bids), true, this.marketDepth);
    this._asks = sortAndTruncateMap(new Map<number, number>(message.asks), false, this.marketDepth);
    this._marketDataUpdated$.next({ bids: Array.from(this._bids), asks: Array.from(this._asks) });
  }

  private processSubscriptionMessage(message: SubscriptionResultMessage) {
    if (message.event === 'subscribed') {
      this._subscribedProduct = message.product_ids[0];
      this._subscribing = false;
    } else if (message.event === 'unsubscribed') {
      this._subscribedProduct = null;
      this._unsubscribing = false;
      this._bids.clear();
      this._asks.clear();
    }
  }

  private processInfoMessage(message: InfoMessage) {
    console.log('Info message:', message);
  }

  private processAlertMessage(message: AlertMessage) {}
}

export const useSocketEventsService = (url: string, marketDepth = 25, marketUpdateBufferTime = 100) => {
  const [service, setService] = useState<SocketEventsService>();
  const [marketData, setMarketData] = useState<MarketSate>({ bids: [], asks: [] });

  useEffect(() => {
    const srv = new SocketEventsService(url, marketDepth, marketUpdateBufferTime);
    console.log('SocketEventsService created');
    const marketUpdatesSubscription = srv.marketDataUpdated$.subscribe(value => setMarketData(value));
    srv.open();
    setService(srv);
    return () => {
      marketUpdatesSubscription.unsubscribe();
      srv?.close();
    };
  }, [marketDepth, url]);

  useEffect(() => {
    if (service) {
      service.marketUpdateBufferTime = marketUpdateBufferTime;
    }
  }, [marketUpdateBufferTime, service]);

  return { marketData, service };
};
