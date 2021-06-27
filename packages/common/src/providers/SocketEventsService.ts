import { bufferWhen, catchError, delay, filter, retryWhen } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, merge, Observable, Subject, throwError, timer } from 'rxjs';

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
  private _messages$: Observable<Message | MarketUpdateMessage[]>;
  private _marketDataUpdated$ = new BehaviorSubject<MarketSate>({
    bids: [],
    asks: [],
  });
  private _errors$ = new Subject();
  private _bids = new Map<number, number>();
  private _asks = new Map<number, number>();

  get opened() {
    return this._opened;
  }

  get opening() {
    return this._opening;
  }

  get subscribedProduct() {
    return this._subscribedProduct;
  }

  get marketDataUpdated$() {
    return this._marketDataUpdated$;
  }

  get open$() {
    return this._openObserver;
  }

  get errors$() {
    return this._errors$;
  }

  constructor(public readonly url: string, private marketDepth: number, public marketUpdateBufferTime: number) {
    this._webSocket = webSocket({
      url: this.url,
      openObserver: this._openObserver,
      closeObserver: this._closeObserver,
      closingObserver: this._closingObserver,
    });

    this._openObserver.subscribe(() => {
      this._opening = false;
      this._opened = true;

      if (this._subscribedProduct) {
        this.subscribeToProduct();
      }
    });

    this._closeObserver.subscribe(() => {
      this._opened = false;
      this._closing = false;
    });

    this._closingObserver.subscribe(() => (this._closing = true));

    const nonBufferedMessages$ = this._webSocket.pipe(filter(message => isNonMarketUpdateMessage(message)));
    const bufferedMessages$ = this._webSocket.pipe(filter(message => isMarketUpdateMessage(message))).pipe(
      bufferWhen(() => timer(this.marketUpdateBufferTime)),
      filter(messages => !!messages.length),
    ) as Observable<MarketUpdateMessage[]>;

    this._messages$ = merge(nonBufferedMessages$, bufferedMessages$).pipe(
      catchError(error => {
        this._errors$.next(error);
        return throwError(error);
      }),
      retryWhen(errors => errors.pipe(delay(1000))),
    );
  }

  open() {
    if (this._opening || this._opened) {
      return;
    }

    this._opening = true;

    this._messages$.subscribe(message => {
      if (Array.isArray(message)) {
        this.processMarketUpdateMessage(message);
      } else {
        if (isMarketSnapshotMessage(message)) {
          this.processSnapshotMessage(message);
        } else if (isSubscriptionResultMessage(message)) {
          this.processSubscriptionMessage(message);
        } else if (isInfoMessage(message)) {
          this.processInfoMessage(message);
        } else if (isAlertMessage(message)) {
          this.processAlertMessage(message);
        }
      }
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

  subscribeToProduct(product?: string) {
    if (this._subscribedProduct === product && (this._opening || this._opened)) {
      throw Error('There is already an active subscription to the product ' + product);
    }

    if (this._subscribedProduct && product) {
      this.unsubscribe();
    }

    if (!this._opening && !this.opened) {
      this.open();
    }

    this._subscribing = true;
    this._webSocket.next({
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: [product || this._subscribedProduct],
    } as RequestMessage);
  }

  unsubscribe() {
    if (!this._subscribedProduct) {
      return;
    }

    this._unsubscribing = true;

    this._webSocket.next({
      event: 'unsubscribe',
      feed: 'book_ui_1',
      product_ids: [this._subscribedProduct],
    } as RequestMessage);
  }

  simulateError() {
    this._errors$.next({ type: 'kill', message: 'I think our app just broke!' });
    this._webSocket.complete();
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

  private processAlertMessage(message: AlertMessage) {
    console.log('Alert message:', message);
  }
}
