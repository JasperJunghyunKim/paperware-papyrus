import { PaginationResponse } from '../../models/pagination';
import Card from '../..//models/card';

export type CardListResponse = PaginationResponse<Card>;
export type CardItemResponse = Card;
