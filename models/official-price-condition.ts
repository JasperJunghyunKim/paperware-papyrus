import OfficialPrice from "./official-price";
import PaperCert from "./paper-cert";
import PaperColor from "./paper-color";
import PaperColorGroup from "./paper-color-group";
import PaperPattern from "./paper-pattern";
import Product from "./product";

export default interface OfficialPriceCondition {
    id: number;
    product: Product;
    grammage: number;
    sizeX: number;
    sizeY: number;
    paperColorGroup: PaperColorGroup | null;
    paperColor: PaperColor | null;
    paperPattern: PaperPattern | null;
    paperCert: PaperCert | null;
    wholesalesPrice: OfficialPrice;
    retailPrice: OfficialPrice;
}