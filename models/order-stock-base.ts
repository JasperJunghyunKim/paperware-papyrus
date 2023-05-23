import {
  Location,
  Packaging,
  PaperCert,
  PaperColor,
  PaperColorGroup,
  PaperPattern,
  Product,
  Warehouse,
} from '.';

export default interface OrderStockBase {
  id: number;
  orderId: number;
  dstLocation: Location;
  warehouse: Warehouse | null;
  product: Product;
  packaging: Packaging;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroup: PaperColorGroup | null;
  paperColor: PaperColor | null;
  paperPattern: PaperPattern | null;
  paperCert: PaperCert | null;
  quantity: number;
  plan?: {
    id: number;
    planNo: string;
  } | null;
}
