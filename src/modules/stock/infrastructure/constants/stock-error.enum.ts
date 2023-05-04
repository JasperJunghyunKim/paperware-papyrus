import { AppError } from 'src/@shared/models/error';

export const STOCK_ERROR = 'StockError';

export enum StockErrorEnum {
  STOCK001 = 'STOCK001',
}

export const StockError: Readonly<{ [key in StockErrorEnum]: AppError }> = {
  [StockErrorEnum.STOCK001]: {
    name: STOCK_ERROR,
    code: 'STOCK001',
    message: '%s 은(는) 존재하지 않는 재고입니다.',
  }
};
