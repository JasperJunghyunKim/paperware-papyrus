import Company from './company';
import Partner from './partner';

export default interface BusinessRelationshipCompact extends Company {
  flag: number;
  partner: Partner;
}
