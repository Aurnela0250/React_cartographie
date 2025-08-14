import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";
import { DomainFilter } from "@/src/entities/filters/domain.filter";
import { Domain } from "@/src/entities/models/domain.entity";

export interface IDomainsRepository {
    getDomains(
        token: string,
        options?: {
            params: PaginationParams;
        }
    ): Promise<PaginatedResult<Domain>>;
    getDomain(token: string, id: number): Promise<Domain>;
    createDomain(
        token: string,
        data: {
            name: string;
        }
    ): Promise<Domain>;
    updateDomain(
        token: string,
        id: number,
        data: {
            name?: string;
        }
    ): Promise<Domain>;
    deleteDomain(token: string, id: number): Promise<boolean>;
    filterDomains(
        token: string,
        options?: {
            params: PaginationParams;
            filters: DomainFilter;
        }
    ): Promise<PaginatedResult<Domain>>;
}
