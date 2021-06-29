export type MarketSide = 'bid' | 'ask';

export interface WebsocketEvent extends Event {
  type: string;
}
