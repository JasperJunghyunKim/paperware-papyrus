import Security from '../../models/security';
import { PaginationQuery } from '../../models/pagination';

export type SecurityQuery = PaginationQuery;
export type SecurityCreateRequest = Omit<Security, 'securityId'>;
export type SecurityUpdateRequest = Omit<Security, 'securityId' | 'securityStatus'>;
export type SecurityUpdateStatusRequest = Pick<Security, 'memo' | 'securityStatus'>;
