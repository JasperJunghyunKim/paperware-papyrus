import { PaginationQuery } from '../../models/pagination';
import { Accounted } from '../../models';

export type PaidQuery = Pick<Accounted, 'partnerId' | 'accountedSubject' | 'accountedMethod'> & { accountedFromDate: string, accountedToDate: string } & PaginationQuery;
