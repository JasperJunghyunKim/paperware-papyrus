import DiscountRate from "./discount-rate";
import { PackagingType, PriceUnit } from "./enum";
import Manufacturer from "./manufacturer";
import PaperCert from "./paper-cert";
import PaperColor from "./paper-color";
import PaperColorGroup from "./paper-color-group";
import PaperDomain from "./paper-domain";
import PaperGroup from "./paper-group";
import PaperPattern from "./paper-pattern";
import PaperType from "./paper-type";

export default interface DiscountRateCondition {
    id: number;
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