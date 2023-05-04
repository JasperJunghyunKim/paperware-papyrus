import {
  Manufacturer,
  Packaging,
  PaperCert,
  PaperColor,
  PaperColorGroup,
  PaperDomain,
  PaperGroup,
  PaperPattern,
  PaperType,
  Product,
} from "../../models";

export interface PaperMetadataResponse {
  paperDomains: PaperDomain[];
  manufacturers: Manufacturer[];
  paperGroups: PaperGroup[];
  paperTypes: PaperType[];
  products: Product[];
  paperColorGroups: PaperColorGroup[];
  paperColors: PaperColor[];
  paperPatterns: PaperPattern[];
  paperCerts: PaperCert[];
  packagings: Packaging[];
}
