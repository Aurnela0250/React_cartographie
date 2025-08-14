import { env } from "@/env.mjs";
import { handleApiResponse, toCamelCaseRecursive } from "@/shared/utils";
import { IDomainsRepository } from "@/src/application/repositories/domains.repository.interface";
import { DomainFilter } from "@/src/entities/filters/domain.filter";
import { Domain } from "@/src/entities/models/domain.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export class DomainsRepository implements IDomainsRepository {
    async getDomains(
        token: string,
        options?: { params: PaginationParams }
    ): Promise<PaginatedResult<Domain>> {
        const { params } = options || { params: { page: 1, perPage: 10 } };
        const { page = 1, perPage = 10 } = params;

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/domains/?page=${page}&per_page=${perPage}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["domains"],
            },
        });
        const data = await handleApiResponse<PaginatedPlain<Domain>>(response);

        const result = toCamelCaseRecursive(data);

        return result;
    }
    getDomain(token: string, id: number): Promise<Domain> {
        throw new Error("Method not implemented.");
    }
    createDomain(token: string, data: { name: string }): Promise<Domain> {
        throw new Error("Method not implemented.");
    }
    updateDomain(
        token: string,
        id: number,
        data: { name?: string }
    ): Promise<Domain> {
        throw new Error("Method not implemented.");
    }
    deleteDomain(token: string, id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    filterDomains(
        token: string,
        options?: { params: PaginationParams; filters: DomainFilter }
    ): Promise<PaginatedResult<Domain>> {
        throw new Error("Method not implemented.");
    }
}
