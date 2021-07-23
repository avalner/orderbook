import { catchError, delay, distinctUntilChanged, filter, retryWhen, take } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, EMPTY, Observable, Subject, throwError } from 'rxjs';
import { RECONNECTION_TIMEOUT } from '../constants';

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

export type MarketSateInternal = {
  bids: Map<number, number>;
  asks: Map<number, number>;
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

function isMarketUpdateMessage(message: Message): message is MarketUpdateMessage {
  return (
    ('bids' in message || 'asks' in message) &&
    'product_id' in message &&
    message.feed === 'book_ui_1' &&
    !('numLevels' in message) &&
    !('event' in message)
  );
}

export class SocketEventsService {
  private _subscribedProduct: string = null;
  private _webSocket: WebSocketSubject<Message>;
  private _openObserver = new Subject();
  private _closeObserver = new Subject();
  private _closingObserver = new Subject();
  private _open$ = new BehaviorSubject(false);
  private _opening$ = new BehaviorSubject(false);
  private _closing$ = new BehaviorSubject(false);
  private _subscribedToProduct$ = new BehaviorSubject(false);
  private _subscribingToProduct$ = new BehaviorSubject(false);
  private _unsubscribingFromProduct$ = new BehaviorSubject(false);
  private _messages$: Observable<Message>;
  private _marketData$ = new BehaviorSubject<MarketSateInternal>({
    bids: new Map(),
    asks: new Map(),
  });
  private _errors$ = new Subject();
  private _bids = new Map<number, number>();
  private _asks = new Map<number, number>();

  get opened() {
    return this._open$.value;
  }

  get closed() {
    return !this._open$.value;
  }

  get opening() {
    return this._opening$.value;
  }

  get closing() {
    return this._closing$.value;
  }

  get subscribing() {
    return this._subscribingToProduct$.value;
  }

  get unsubscribing() {
    return this._unsubscribingFromProduct$.value;
  }

  get subscribedProduct() {
    return this._subscribedProduct;
  }

  get marketData$() {
    return this._marketData$;
  }

  get marketData() {
    return this._marketData$.value;
  }

  get open$() {
    return this._open$.pipe(
      distinctUntilChanged(),
      filter(value => value),
    );
  }

  get closed$() {
    return this._open$.pipe(
      distinctUntilChanged(),
      filter(value => !value),
    );
  }

  get opening$() {
    return this._opening$.pipe(distinctUntilChanged());
  }

  get subscribingToProduct$() {
    return this._subscribingToProduct$.pipe(distinctUntilChanged());
  }

  get subscribedToProduct$() {
    return this._subscribedToProduct$.pipe(distinctUntilChanged());
  }

  get unsubscribingFromProduct$() {
    return this._unsubscribingFromProduct$.pipe(distinctUntilChanged());
  }

  get errors$() {
    return this._errors$.asObservable();
  }

  constructor(public readonly url: string) {
    this._webSocket = webSocket({
      url: this.url,
      openObserver: this._openObserver,
      closeObserver: this._closeObserver,
      closingObserver: this._closingObserver,
    });

    this._openObserver.subscribe(() => {
      this._opening$.next(false);
      this._open$.next(true);

      // restore product subscription on open
      if (this._subscribedProduct) {
        this.subscribeToProduct();
      }
    });

    this._closeObserver.subscribe(() => {
      this._closing$.next(false);
      this._open$.next(false);
      this._subscribingToProduct$.next(false);
    });

    this._closingObserver.subscribe(() => {
      this._open$.next(false);
      this._closing$.next(true);
    });

    this._messages$ = this._webSocket.pipe(
      catchError(error => {
        if (error.type === 'close') {
          return EMPTY;
        }

        this._errors$.next(error);
        return throwError(error);
      }),
      retryWhen(errors => errors.pipe(delay(RECONNECTION_TIMEOUT))),
    );
  }

  open() {
    if (this._open$.value) {
      console.log('open is blocked');
      return;
    }

    this._opening$.next(true);

    this._messages$.subscribe(message => {
      if (isMarketSnapshotMessage(message)) {
        this.processMarketSnapshotMessage(message);
      } else if (isMarketUpdateMessage(message)) {
        this.processMarketUpdateMessage(message);
      } else if (isSubscriptionResultMessage(message)) {
        this.processSubscriptionMessage(message);
      } else if (isInfoMessage(message)) {
        this.processInfoMessage(message);
      } else if (isAlertMessage(message)) {
        this.processAlertMessage(message);
      }
    });
  }

  close() {
    if (!this._open$.value) {
      console.log('close is blocked');
      return;
    }

    this._closing$.next(true);
    this._webSocket.complete();
  }

  subscribeToProduct(product?: string) {
    if (this._subscribingToProduct$.value || this._unsubscribingFromProduct$.value || this._closing$.value) {
      console.log('subscribing is blocked');
      return;
    }

    this.clearMarketData();
    this.emitCurrentMarketData();

    if (!this._open$.value && !this._opening$.value) {
      this.open();
    }

    if (this._subscribedProduct && product) {
      this.unsubscribe().then(() => {
        this._subscribingToProduct$.next(true);
        this._webSocket.next({
          event: 'subscribe',
          feed: 'book_ui_1',
          product_ids: [product || this._subscribedProduct],
        } as RequestMessage);
      });

      return;
    }

    this._subscribingToProduct$.next(true);
    this._webSocket.next({
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: [product || this._subscribedProduct],
    } as RequestMessage);
  }

  unsubscribe() {
    if (
      !this._subscribedProduct ||
      !this._open$.value ||
      this._unsubscribingFromProduct$.value ||
      this._subscribingToProduct$.value
    ) {
      console.log('unsubscribing is blocked');
      return;
    }

    this._unsubscribingFromProduct$.next(true);
    this._webSocket.next({
      event: 'unsubscribe',
      feed: 'book_ui_1',
      product_ids: [this._subscribedProduct],
    } as RequestMessage);

    return new Promise(res => {
      this._unsubscribingFromProduct$
        .pipe(
          filter(value => !value),
          take(1),
        )
        .subscribe(() => {
          res(true);
        });
    });
  }

  simulateError() {
    this._errors$.next({ type: 'kill', message: 'I think our app just broke!' });
    this._webSocket.complete();
  }

  private processMarketUpdateMessage(message: MarketUpdateMessage) {
    if (message.product_id !== this._subscribedProduct) {
      return;
    }

    message.bids?.forEach(bid => {
      if (bid[1] === 0) {
        this._bids.delete(bid[0]);
      } else {
        this._bids.set(bid[0], bid[1]);
      }
    });

    message.asks?.forEach(ask => {
      if (ask[1] === 0) {
        this._asks.delete(ask[0]);
      } else {
        this._asks.set(ask[0], ask[1]);
      }
    });

    this.emitCurrentMarketData();
  }

  private processMarketSnapshotMessage(message: MarketSnapshotMessage) {
    this._bids = new Map<number, number>(message.bids);
    this._asks = new Map<number, number>(message.asks);
    this.emitCurrentMarketData();
  }

  private processSubscriptionMessage(message: SubscriptionResultMessage) {
    if (message.event === 'subscribed') {
      this._subscribedProduct = message.product_ids[0];
      this._subscribingToProduct$.next(false);
      this._subscribedToProduct$.next(true);
    } else if (message.event === 'unsubscribed') {
      this._subscribedProduct = null;
      this._subscribedToProduct$.next(false);
      this._unsubscribingFromProduct$.next(false);
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

  private emitCurrentMarketData() {
    this._marketData$.next({ bids: this._bids, asks: this._asks });
  }

  private clearMarketData() {
    this._bids.clear();
    this._asks.clear();
  }
}
