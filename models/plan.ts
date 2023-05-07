import { Company, Enum, StockGroupEvent } from '.';

export default interface Plan {
  id: number;
  planNo: string;
  company: Company;
  status: Enum.PlanStatus;
  createdAt: string;
  targetStockGroupEvent: StockGroupEvent;
}
