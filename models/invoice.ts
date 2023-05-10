import {
  Packaging,
  PaperCert,
  PaperColor,
  PaperColorGroup,
  PaperPattern,
  Plan,
  Product,
  Shipping,
} from '.';

export default interface Invoice {
  id: number;
  invoiceNo: string;
  shipping: Shipping | null;
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
  plan: Plan;
}
