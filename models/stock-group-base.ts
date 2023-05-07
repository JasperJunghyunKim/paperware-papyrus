import { Company } from '.';
import Packaging from './packaging';
import PaperCert from './paper-cert';
import PaperColor from './paper-color';
import PaperColorGroup from './paper-color-group';
import PaperPattern from './paper-pattern';
import Product from './product';
import Warehouse from './warehouse';

export default interface StockGroupBase {
  id: number;
  company: Company;
  product: Product;
  packaging: Packaging;
  grammage: number;
  sizeX: number;
  sizeY: number;
  paperColorGroup: PaperColorGroup | null;
  paperColor: PaperColor | null;
  paperPattern: PaperPattern | null;
  paperCert: PaperCert | null;
  warehouse: Warehouse;
}
