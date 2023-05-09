import { Entity, Accounted } from ".";
export default interface ByCash extends Entity {
    id: number;
    cashAmount: number;
    isDeleted: boolean;
    accountedId: number;
    accounted: Accounted;
}