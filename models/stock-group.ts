import { Company, OrderStockBase } from "../models";
import StockGroupBase from "./stock-group-base";

export default interface StockGroup extends StockGroupBase {
  orderCompanyInfo: Company | null;
  orderInfo: {
    wantedDate: string;
  } | null;
  orderStock: OrderStockBase | null;
  totalQuantity: number;
  availableQuantity: number;
}
