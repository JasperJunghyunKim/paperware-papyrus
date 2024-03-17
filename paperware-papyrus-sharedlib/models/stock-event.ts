import { StockEventStatus } from './enum';
import Stock from './stock';

export default interface StockEvent {
  id: number;
  stock: Stock;
  change: number;
  status: StockEventStatus;
}
