import { AccountedType, Subject } from "../models/enum";

/**
 * 회계 타입에 따른 회계 과목
 *
 * @param accountedType 회계 타입
 * @example
 * /// paid: 외상 매출금 collected: 외상 매입금
 * ACCOUNTS_RECEIVABLE
 * /// paid: 미수금 collected: 미지급금
 * UNPAID
 * /// paid: 선수금 collected: 선지급금
 * ADVANCES
 * /// paid: 잡이익 collected: 잡손실
 * MISCELLANEOUS_INCOME
 * /// paid: 상품 매출 collected: 상품 매입
 * PRODUCT_SALES
 * /// 기타
 * ETC
 * /// 전체
 * All
 */
export const accountedSubject = (accountedType: AccountedType, subject: Subject): string => {
  if (accountedType === 'PAID') {
    switch (subject) {
      case 'ACCOUNTS_RECEIVABLE':
        return '외상 매출금';
      case 'UNPAID':
        return '미수금';
      case 'ADVANCES':
        return '선수금';
      case 'MISCELLANEOUS_INCOME':
        return '잡이익';
      case 'PRODUCT_SALES':
        return '상품 매출';
      case 'ETC':
        return '기타';
      case 'All':
        return '전체';
    }
  } else {
    switch (subject) {
      case 'ACCOUNTS_RECEIVABLE':
        return '외상 매입금';
      case 'UNPAID':
        return '미지급금';
      case 'ADVANCES':
        return '선지급금';
      case 'MISCELLANEOUS_INCOME':
        return '잡손실';
      case 'PRODUCT_SALES':
        return '상품 매입';
      case 'ETC':
        return '기타';
      case 'All':
        return '전체';
    }
  }
}
