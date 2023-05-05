import { PackagingType } from './enum';

export default interface Packaging {
  id: number;
  type: PackagingType;
  packA: number;
  packB: number;
}
