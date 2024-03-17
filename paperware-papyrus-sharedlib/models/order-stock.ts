import { Location, OrderStockBase, Packaging, PaperCert, PaperColor, PaperColorGroup, PaperPattern, Product, Warehouse } from '.';

export default interface OrderStock extends OrderStockBase {
  orderStock: OrderStockBase | null;
}
