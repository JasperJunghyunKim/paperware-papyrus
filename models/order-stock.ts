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

export default interface OrderStock {
  id: number;
  orderId: number;
  dstLocation: Location;
  warehouse: Warehouse;
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
}
