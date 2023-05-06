import { Enum } from '.';
import StockGroupBase from './stock-group-base';

export default interface StockGroupEvent {
  id: number;
  stockGroup: StockGroupBase;
  change: number;
  status: Enum.StockEventStatus;
}
