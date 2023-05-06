import { Company, StockGroupEvent } from '.';

export default interface Plan {
  id: number;
  planNo: string;
  company: Company;
  createdAt: string;
  targetStockGroupEvent: StockGroupEvent;
}
