import { AccountType, Bank } from "./enum";

export default interface BankAccount {
  /**
   * 계좌 식별자
   */
  accountId: number;
  /**
   * 은행 이름
   */
  bankComapny: Bank;
  /**
   * 계좌 이름
   */
  accountName: string;
  /**
   * 계좌 종류
   */
  accountType: AccountType;
  /**
   * 계좌 번호
   */
  accountNumber: string;
  /**
   * 계좌 소유자
   */
  accountHolder: string;
}
