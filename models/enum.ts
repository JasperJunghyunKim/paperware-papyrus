export type PackagingType = 'ROLL' | 'REAM' | 'SKID' | 'BOX';
export type OfficialPriceType =
  | 'NONE'
  | 'MANUAL_NONE'
  | 'MANUAL_DEFAULT'
  | 'RETAIL'
  | 'WHOLESALE';
export type PriceUnit = 'WON_PER_TON' | 'WON_PER_REAM' | 'WON_PER_BOX';
export type ShippingType = 'DELIVERY' | 'PICKUP' | 'STORE';
export type StockEventStatus = 'NORMAL' | 'CANCELLED' | 'PENDING';
export type TaskType = 'CONVERTING' | 'GUILLOTINE' | 'QUANTITY';
export type DiscountType = 'DEFAULT' | 'SPECIAL';
export type BusinessRelationshipRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED';
export type OrderStatus =
  | 'PREPARING'
  | 'CANCELLED'
  | 'ESTIMATE'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'REJECTED';
export type PlanStatus = 'PREPARING' | 'PROGRESSING' | 'PROGRESSED';
export type TaskStatus = 'PREPARING' | 'PROGRESSING' | 'PROGRESSED';
export type Method = 'ACCOUNT_TRANSFER' | 'PROMISSORY_NOTE' | 'CARD_PAYMENT' | 'CASH' | 'SET_OFF' | 'ETC';
export type Subject =
  'PAID_ACCOUNTS_RECEIVABLE'
  | 'PAID_UNPAID_AMOUNTS'
  | 'PAID_ADVANCES'
  | 'PAID_MISCELLANEOUS_INCOME'
  | 'PAID_PRODUCT_SALES'
  | 'COLLECTED_ACCOUNTS_RECEIVABLE'
  | 'COLLECTED_UNPAID_EXPENSES'
  | 'COLLECTED_PREPAID_EXPENSES'
  | 'COLLECTED_MISCELLANEOUS_LOSSES'
  | 'COLLECTED_PRODUCT_PURCHASES'
  | 'ETC';
export type Colleted_Subject = ''
