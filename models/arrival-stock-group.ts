import { Company, OrderStockBase } from ".";
import StockGroupBase from "./stock-group-base";

export default interface ArrivalStockGroup extends StockGroupBase {
  orderCompanyInfo: Company | null;
  orderInfo: {
    wantedDate: string;
  } | null;
  orderStock: OrderStockBase | null;
  totalQuantity: number;
  storingQuantity: number;
  nonStoringQuantity: number;
}
