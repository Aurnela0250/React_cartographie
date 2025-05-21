import { Formation } from "@/core/entities/formation.entity";
import {
    PaginatedPlain,
    PaginatedResult,
    PaginationParams,
} from "@/core/entities/pagination";
import { IFormationRepository } from "@/core/interfaces/formation.repository.interface";
import { env } from "@/env.mjs";
import { toCamelCaseRecursive, toSnakeCaseRecursive } from "@/shared/utils";
import { handleApiResponse } from "@/shared/utils/api-errors";

export class FormationApiRepository implements IFormationRepository {
    async getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Formation>> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations?page=${param.page}&per_page=${param.perPage || 10}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<PaginatedPlain<unknown>>(response);
        const camelCasedData = toCamelCaseRecursive(data);
        const paginatedRaw = PaginatedResult.fromPlain(camelCasedData);

        return PaginatedResult.mapItemsToEntity(paginatedRaw, Formation);
    }
    async get(token: string, id: number): Promise<Formation> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/${id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await handleApiResponse<unknown>(response);

        return Formation.fromUnknown(toCamelCaseRecursive(data));
    }
    async create(
        token: string,
        data: {
            intitule: string;
            description?: string;
            duration: number;
            levelId: number;
            mentionId: number;
            establishmentId: number;
            authorizationId?: number;
        }
    ): Promise<Formation> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations`;
        const payload = toSnakeCaseRecursive(data);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const res = await handleApiResponse<unknown>(response);

        return Formation.fromUnknown(toCamelCaseRecursive(res));
    }
    async update(
        token: string,
        id: number,
        data: {
            intitule?: string;
            description?: string;
            duration?: number;
            levelId?: number;
            mentionId?: number;
            establishmentId?: number;
            authorizationId?: number;
        }
    ): Promise<Formation> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/${id}`;
        const payload = toSnakeCaseRecursive(data);
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const res = await handleApiResponse<unknown>(response);

        return Formation.fromUnknown(toCamelCaseRecursive(res));
    }
    async delete(token: string, id: number): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
    async createFormationAuthorization(
        token: string,

        id: number,
        data: {
            dateDebut: string;
            dateFin?: string;
            status: "REQUESTED" | "VALIDATED" | "REFUSED" | "EXPIRED";
            arrete?: string;
        }
    ): Promise<Formation> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/${id}/authorization`;
        const payload = toSnakeCaseRecursive(data);

        console.log("payload", payload);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const res = await handleApiResponse<unknown>(response);

        return Formation.fromUnknown(toCamelCaseRecursive(res));
    }
    async updateFormationAuthorization(
        token: string,
        formationId: number,
        data: {
            date_debut?: string;
            date_fin?: string;
            status?: "REQUESTED" | "VALIDATED" | "REFUSED" | "EXPIRED";
            arrete?: string;
        }
    ): Promise<Formation> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/${formationId}/authorization`;
        const payload = toSnakeCaseRecursive(data);
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const res = await handleApiResponse<unknown>(response);

        return Formation.fromUnknown(toCamelCaseRecursive(res));
    }
    async createFormationAnnualHeadCount(
        token: string,
        formationId: number,
        data: {
            academicYear: number;
            students: number;
        }
    ): Promise<Formation> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/${formationId}/annual-headcount`;
        const payload = toSnakeCaseRecursive(data);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const res = await handleApiResponse<unknown>(response);

        return Formation.fromUnknown(toCamelCaseRecursive(res));
    }
    async updateFormationAnnualHeadCount(
        token: string,
        formationId: number,
        id: number,
        data: {
            academicYear?: number;
            students?: number;
        }
    ): Promise<Formation> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/${formationId}/annual-headcount/${id}`;
        const payload = toSnakeCaseRecursive(data);
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const res = await handleApiResponse<unknown>(response);

        return Formation.fromUnknown(toCamelCaseRecursive(res));
    }
    async deleteFormationAnnualHeadCount(
        token: string,
        formationId: number,
        id: number
    ): Promise<boolean> {
        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/formations/${formationId}/annual-headcount/${id}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        await handleApiResponse<unknown>(response);

        return true;
    }
}
