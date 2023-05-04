import Manufacturer from './manufacturer';
import PaperDomain from './paper-domain';
import PaperGroup from './paper-group';
import PaperType from './paper-type';

export default interface Product {
  id: number;
  paperDomain: PaperDomain;
  manufacturer: Manufacturer;
  paperGroup: PaperGroup;
  paperType: PaperType;
}
