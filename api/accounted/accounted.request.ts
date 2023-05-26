import { PaginationQuery } from '../../models/pagination';
import { Accounted } from '../../models';

export type AccountedQuery = Pick<Accounted, 'companyId' | 'companyRegistrationNumber' | 'accountedSubject' | 'accountedMethod' | 'accountedType'> & { partnerNickName: string, accountedFromDate: string, accountedToDate: string } & PaginationQuery;
