export const FEED_URL = 'wss://www.cryptofacilities.com/ws/v1';
export const MARKET_DEPTH = 100;
export const DEFAULT_FEED_BUFFER_TIME = 500;
export const RECONNECTION_TIMEOUT = 1000;

export const PRODUCT = {
  bitcoin: 'PI_XBTUSD',
  ethereum: 'PI_ETHUSD',
};

export const DEFAULT_PRODUCT = PRODUCT.bitcoin;

export const PRODUCT_NAMES = {
  PI_XBTUSD: 'BTC/USD',
  PI_ETHUSD: 'ETH/USD',
};

export const PRODUCT_GROUPS = {
  PI_XBTUSD: [0.5, 1.0, 2.5],
  PI_ETHUSD: [0.05, 0.1, 0.25],
};

export const UPDATE_INTERVALS = [100, 500, 1000, 2000];
