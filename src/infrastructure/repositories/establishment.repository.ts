import { env } from "@/env.mjs";
import { handleApiResponse, toCamelCaseRecursive } from "@/shared/utils";
import { IEstablishmentRepository } from "@/src/application/repositories/establishment.repository.interface";
import { EstablishmentFilter } from "@/src/entities/filters/establishment.filter";
import { Establishment } from "@/src/entities/models/establishment.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";
import { Rate } from "@/src/entities/models/rate.entity";

export class EstablishmentRepository implements IEstablishmentRepository {
    getEstablishments(
        token: string,
        options?: { params: PaginationParams }
    ): Promise<PaginatedResult<Establishment>> {
        throw new Error("Method not implemented.");
    }
    getEstablishment(token: string, id: number): Promise<Establishment> {
        throw new Error("Method not implemented.");
    }
    createEstablishment(
        token: string,
        data: {
            name: string;
            acronym?: string;
            address?: string;
            contacts?: string[];
            website?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishmentTypeId: number;
            cityId: number;
        }
    ): Promise<Establishment> {
        throw new Error("Method not implemented.");
    }
    updateEstablishment(
        token: string,
        id: number,
        data: {
            name: string;
            acronym?: string;
            address?: string;
            contacts?: string[];
            website?: string;
            description?: string;
            latitude?: number;
            longitude?: number;
            establishmentTypeId: number;
            cityId: number;
        }
    ): Promise<Establishment> {
        throw new Error("Method not implemented.");
    }
    deleteEstablishment(token: string, id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async filterEstablishments(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: EstablishmentFilter;
        }
    ): Promise<PaginatedResult<Establishment>> {
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
        ) as EstablishmentFilter;

        const appendParam = (
            key: string,
            value?: string | number | (string | number)[] | null
        ) => {
            if (value === null || value === undefined) return;
            if (Array.isArray(value)) {
                for (const v of value) {
                    if (v !== null && v !== undefined && `${v}` !== "")
                        qp.append(key, String(v));
                }
            } else if (`${value}` !== "") {
                qp.append(key, String(value));
            }
        };

        // Map camelCase filters to snake_case API params
        appendParam("name", cleanedFilters.name ?? null);
        appendParam("name_contains", cleanedFilters.nameContains ?? null);
        appendParam("name_starts_with", cleanedFilters.nameStartsWith ?? null);
        appendParam("name_ends_with", cleanedFilters.nameEndsWith ?? null);
        appendParam("city_ids", cleanedFilters.cityIds ?? null);
        appendParam(
            "establishment_type_ids",
            cleanedFilters.establishmentTypeIds ?? null
        );
        appendParam("level_ids", cleanedFilters.levelIds ?? null);
        appendParam("domain_ids", cleanedFilters.domainIds ?? null);
        appendParam("mention_ids", cleanedFilters.mentionIds ?? null);
        appendParam("legal_statuses", cleanedFilters.legalStatuses ?? null);
        appendParam("acronym", cleanedFilters.acronym ?? null);
        appendParam("acronym_contains", cleanedFilters.acronymContains ?? null);
        appendParam(
            "acronym_starts_with",
            cleanedFilters.acronymStartsWith ?? null
        );
        appendParam(
            "acronym_ends_with",
            cleanedFilters.acronymEndsWith ?? null
        );

        const base = `${env.API_PREFIX_URL}/${env.API_VERSION}/establishments/filter/`;
        const url = `${base}?${qp.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                // Vary cache by pagination + filters
                tags: [
                    "establishments",
                    `establishments:page:${page}`,
                    `establishments:per_page:${perPage}`,
                    `establishments:filters:${qp.toString()}`,
                ],
            },
        });
        const data =
            await handleApiResponse<PaginatedPlain<Establishment>>(response);

        const result = toCamelCaseRecursive(data);

        return result;
    }
    rateEstablishment(
        token: string,
        id: number,
        data: { rating: number }
    ): Promise<Rate> {
        throw new Error("Method not implemented.");
    }
}
