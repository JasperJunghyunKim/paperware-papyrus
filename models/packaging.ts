import { PackagingType } from './enum';

export default interface PaperType {
  id: number;
  type: PackagingType;
  packA: number;
  packB: number;
}
