import Card from '../..//models/card';
import { PaginationQuery } from '../../models/pagination';

export type CardQuery = PaginationQuery;
export type CardCreateRequest = Card;
export type CardUpdateRequest = Pick<Card, 'cardName'>;
