import { IDomainsRepository } from "@/src/application/repositories/domains.repository.interface";
import { City } from "@/src/entities/models/city.entity";
import { Domain } from "@/src/entities/models/domain.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IGetDomainsUseCase = ReturnType<typeof getDomainsUseCase>;

export const getDomainsUseCase =
    (domainRepository: IDomainsRepository) =>
    async (
        token: string,
        options?: {
            params: PaginationParams;
        }
    ): Promise<PaginatedResult<Domain>> => {
        // TODO: Check the permission if is valid

        const domains = await domainRepository.getDomains(token, options);

        return domains;
    };
