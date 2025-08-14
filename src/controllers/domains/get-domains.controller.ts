import { IGetDomainsUseCase } from "@/src/application/use-cases/domains/get-domains.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Domain } from "@/src/entities/models/domain.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export type IGetDomainsController = ReturnType<typeof getDomainsController>;

export const getDomainsController =
    (getDomainsUseCase: IGetDomainsUseCase) =>
    async (
        token: string | undefined,
        options?: {
            params: PaginationParams;
        }
    ): Promise<PaginatedResult<Domain>> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }

        const domains = await getDomainsUseCase(token, options);

        return domains;
    };
