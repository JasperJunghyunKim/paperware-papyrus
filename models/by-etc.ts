import { Accounted, Entity } from ".";

export default interface ByEtc extends Entity {
    id: number;
    etcAmount: number;
    isDeleted: boolean;
    accountedId: number;
    accounted: Accounted;
}