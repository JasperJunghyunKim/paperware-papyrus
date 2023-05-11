import { Accounted } from '@/@shared/models';
import { PaginationQuery } from '../../models/pagination';

export type CollectedQuery = Pick<Accounted, 'partnerId' | 'accountedSubject' | 'accountedMethod'> & { accountedFromDate: string, accountedToDate: string } & PaginationQuery;
