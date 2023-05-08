import Company from "./company";
import Packaging from "./packaging";
import PaperCert from "./paper-cert";
import PaperColor from "./paper-color";
import PaperColorGroup from "./paper-color-group";
import Product from "./product";
import StockPrice from "./stock-price";
import Warehouse from "./warehouse";

export default interface Stock {
    id: number;
    serial: string;
    company: Company;
    grammage: number;
    sizeX: number;
    sizeY: number;
    totalQuantity: number;
    availableQuantity: number;
    isSyncPrice: boolean;
    warehouse: Warehouse | null;
    product: Product;
    packaging: Packaging;
    paperColorGroup: PaperColorGroup | null;
    paperColor: PaperColor | null;
    paperCert: PaperCert | null;
    stockPrice: StockPrice | null;
}