import { Company, Enum, Order, StockGroupEvent } from '.';

export default interface Plan {
  id: number;
  planNo: string;
  company: Company;
  status: Enum.PlanStatus;
  createdAt: string;
  targetStockGroupEvent: StockGroupEvent;
  orderStock: {
    order: Order;
  } | null;
}
