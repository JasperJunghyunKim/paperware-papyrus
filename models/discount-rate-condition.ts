import DiscountRate from './discount-rate';
import { PackagingType } from './enum';
import Manufacturer from './manufacturer';
import PaperCert from './paper-cert';
import PaperColor from './paper-color';
import PaperColorGroup from './paper-color-group';
import PaperDomain from './paper-domain';
import PaperGroup from './paper-group';
import PaperPattern from './paper-pattern';
import PaperType from './paper-type';
import Partner from './partner';

export default interface DiscountRateCondition {
  id: number;
  partner: Partner;
  packagingType: PackagingType;
  paperDomain?: PaperDomain;
  manufacturer?: Manufacturer;
  paperGroup?: PaperGroup;
  paperType?: PaperType;
  grammage?: number;
  sizeX?: number;
  sizeY?: number;
  paperColorGroup?: PaperColorGroup;
  paperColor?: PaperColor;
  paperPattern?: PaperPattern;
  paperCert?: PaperCert;
  basicDiscountRate: DiscountRate;
  specialDiscountRate: DiscountRate;
}
