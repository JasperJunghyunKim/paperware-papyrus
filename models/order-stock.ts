import {
  Location,
  Packaging,
  PaperCert,
  PaperColor,
  PaperColorGroup,
  PaperPattern,
  Plan,
  Product,
  StockGroup,
} from '.';

export default interface OrderStock {
  id: number;
  orderId: number;
  dstLocation: Location;
  product: Product;
  packaging: Packaging;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroup: PaperColorGroup;
  paperColor: PaperColor;
  paperPattern: PaperPattern;
  paperCert: PaperCert;
  quantity: number;
}
