import { env } from "@/env.mjs";
import {
    handleApiResponse,
    toCamelCaseRecursive,
    toSnakeCaseRecursive,
} from "@/shared/utils";
import { IFormationRepository } from "@/src/application/repositories/formation.repository.interface";
import { FormationFilter } from "@/src/entities/filters/formation.filter";
import { Formation } from "@/src/entities/models/formation.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export class FormationsRepository implements IFormationRepository {
    async getFormations(
        token: string,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<Formation>> {
        const { params } = options || { params: { page: 1, perPage: 10 } };
        const { page, perPage } = params || { page: 1, perPage: 10 };

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/?page=${page}&per_page=${perPage}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["formations", `pagination:${page}-${perPage}`],
            },
        });
        const data =
            await handleApiResponse<PaginatedPlain<Formation>>(response);

        const result = toCamelCaseRecursive(data);

        return result;
    }
    async getFormation(token: string, id: number): Promise<Formation> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/${id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["formation"],
            },
        });
        const data = await handleApiResponse<Formation>(response);

        const result = toCamelCaseRecursive(data);

        return result;
    }
    createFormation(
        token: string,
        data: {
            name: string;
            description?: string;
            duration: number;
            levelId: number;
            mentionId: number;
            establishmentId: number;
            authorizationId?: number;
        }
    ): Promise<Formation> {
        throw new Error("Method not implemented.");
    }
    updateFormation(
        token: string,
        id: number,
        data: {
            name?: string;
            description?: string;
            duration?: number;
            levelId?: number;
            mentionId?: number;
            establishmentId?: number;
            authorizationId?: number;
        }
    ): Promise<Formation> {
        throw new Error("Method not implemented.");
    }
    deleteFormation(token: string, id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async filterFormations(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: FormationFilter;
        }
    ): Promise<PaginatedResult<Formation>> {
        const { params } = options || { params: { page: 1, perPage: 10 } };
        const { page, perPage } = params || { page: 1, perPage: 10 };

        // Build query params with duplication for arrays
        const qp = new URLSearchParams();
        qp.set("page", String(page ?? 1));
        qp.set("per_page", String(perPage ?? 10));

        const filters = options?.filters ?? {};
        // Remove null/undefined/empty string values
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(
                ([, value]) =>
                    value !== null && value !== undefined && value !== ""
            )
        ) as FormationFilter;

        // Build filter URL with pagination
        const filterParams = new URLSearchParams({
            page: params?.page?.toString() || "1",
            per_page: params?.perPage?.toString() || "10",
            ...toSnakeCaseRecursive(cleanedFilters as Record<string, string>),
        });

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/filter/?${filterParams.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["formations", `filters:${filterParams.toString()}`],
            },
        });
        const data =
            await handleApiResponse<PaginatedPlain<Formation>>(response);

        const result = toCamelCaseRecursive(data);

        return result;
    }
}
