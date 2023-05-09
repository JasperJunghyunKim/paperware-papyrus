import { Location, Plan, StockGroup } from '.';

export default interface OrderStock {
  id: number;
  orderId: number;
  dstLocation: Location;
  plan: Plan | null;
  stockGroup: StockGroup;
  quantity: number;
}
