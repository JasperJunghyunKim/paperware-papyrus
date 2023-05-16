import { CardCompany } from "./enum";

export default interface Card {
  /**
   * 카드 식별자
   */
  cardId: number;
  /**
   * 카드 이름
   */
  cardName: string;
  /**
   * 카드 회사
   */
  cardCompany: CardCompany;
  /**
   * 카드 번호
   */
  cardNumber: string;
  /**
   * 카드 소유자
   */
  cardHolder: string;
}
