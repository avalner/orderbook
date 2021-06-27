import OrderbookTable from './OrderbookTable';

export default {
  title: 'Modules/OrderbookTable',
  component: OrderbookTable,
};

const bids: [number, number][] = [
  [33800, 2100],
  [33798, 10],
  [33794, 200],
  [33790.5, 2246],
  [33790, 40000],
  [33789.5, 1200],
  [33789, 7116],
  [33788.5, 4450],
  [33784.5, 12500],
  [33782.5, 3209],
  [33782, 2920],
  [33775, 356],
  [33774.5, 30000],
  [33774, 3377],
  [33773.5, 5000],
  [33771.5, 2500],
  [33771, 1856],
  [33767, 63128],
  [33766.5, 20000],
  [33766, 228977],
  [33765, 7883],
  [33764.5, 146571],
  [33763.5, 151929],
  [33763, 22711],
  [33762.5, 1853],
];

const asks: [number, number][] = [
  [33829.5, 1199],
  [33830, 510],
  [33832.5, 3330],
  [33833, 3358],
  [33836.5, 3126],
  [33837, 2500],
  [33837.5, 921],
  [33838, 1011],
  [33838.5, 3054],
  [33840.5, 87381],
  [33841, 30000],
  [33844, 1867],
  [33846, 5194],
  [33849, 3810],
  [33849.5, 5000],
  [33850, 157],
  [33852.5, 1874],
  [33853.5, 2925],
  [33854, 2052],
  [33855.5, 2064],
  [33856, 8653],
  [33857, 119976],
  [33857.5, 20000],
  [33858.5, 160916],
  [33859, 9635],
];

export const Default = args => <OrderbookTable bids={bids} asks={asks} group={1.0} />;
