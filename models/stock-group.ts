import { Company, OrderStockBase } from "../models";
import Packaging from "./packaging";
import PaperCert from "./paper-cert";
import PaperColor from "./paper-color";
import PaperColorGroup from "./paper-color-group";
import PaperPattern from "./paper-pattern";
import Product from "./product";
import Warehouse from "./warehouse";

type WarehouseWithoutCompany = Omit<Warehouse, "company">;

export default interface StockGroup {
  orderCompanyInfo: Company | null;
  orderInfo: {
    wantedDate: string;
  } | null;
  warehouse: WarehouseWithoutCompany | null;
  product: Product;
  packaging: Packaging;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroup: PaperColorGroup | null;
  paperColor: PaperColor | null;
  paperPattern: PaperPattern | null;
  paperCert: PaperCert | null;
  orderStock: OrderStockBase | null;
  totalQuantity: number;
  availableQuantity: number;
}
