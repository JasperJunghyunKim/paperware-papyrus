export type PackagingType = "ROLL" | "REAM" | "SKID" | "BOX";
export type OfficialPriceType = "NONE" | "MANUAL" | "RETAIL" | "WHOLESALE";
export type PriceUnit = "WON_PER_TON" | "WON_PER_REAM" | "WON_PER_BOX";
export type ShippingType = "DELIVERY" | "PICKUP" | "STORE";
export type StockEventStatus = "NORMAL" | "CANCELLED" | "PENDING";
export type TaskType = "CONVERTING" | "GUILLOTINE";
export type DiscountType = "DEFAULT" | "SPECIAL";
export type BusinessRelationshipRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED";
export type OrderStatus =
  | "PREPARING"
  | "CANCELLED"
  | "ESTIMATE"
  | "REQUESTED"
  | "ACCEPTED"
  | "REJECTED";
export type PlanStatus =
  | "PREPARING"
  | "PROGRESSING"
  | "PROGRESSED"
  | "RELEASED";
