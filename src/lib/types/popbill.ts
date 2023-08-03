export interface PobillException {
    code: number;
    message: string;
} 

export interface PopbillDefaultResponse {
    code: number;
    message: string;
} 

export interface PopbillGetCorpInfoResponse {
    ceoname: string;
    corpName: string;
    addr: string;
    bizType: string;
    bizClass: string;
}