import Security from '../../models/security';
import { PaginationQuery } from '../../models/pagination';

export type SecurityQuery = PaginationQuery;
export type SecurityCreateRequest = Omit<Security, 'securityId' | 'drawedStatus' | 'securityStatus'>;
export type SecurityUpdateRequest = Omit<Security, 'securityId'>;
export type SecurityUpdateStatusRequest = Pick<Security, 'memo' | 'securityStatus'>;
