import { env } from "@/env.mjs";
import { handleApiResponse, toCamelCaseRecursive } from "@/shared/utils";
import { ILevelsRepository } from "@/src/application/repositories/levels.repository.interface";
import { LevelFilter } from "@/src/entities/filters/level.filter";
import { Level } from "@/src/entities/models/level.entity";
import { PaginatedPlain, PaginatedResult, PaginationParams } from "@/src/entities/models/pagination";

export class LevelsRepository implements ILevelsRepository {
    async getLevels(
        token: string,
        options?: { params: PaginationParams }
    ): Promise<PaginatedResult<Level>> {
        const { params } = options || { params: { page: 1, perPage: 10 } };
        const { page = 1, perPage = 10 } = params;

        const url = `${env.API_PREFIX_URL}/${env.API_VERSION}/levels/?page=${page}&per_page=${perPage}`;

        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            next: {
                tags: ["levels"],
            },
        });
        const data = await handleApiResponse<PaginatedPlain<Level>>(response);

        const result = toCamelCaseRecursive(data);

        return result;
    }
    getLevel(token: string, id: number): Promise<Level> {
        throw new Error("Method not implemented.");
    }
    createLevel(
        token: string,
        data: { name: string; acronym?: string }
    ): Promise<Level> {
        throw new Error("Method not implemented.");
    }
    updateLevel(
        token: string,
        id: number,
        data: { name?: string; acronym?: string }
    ): Promise<Level> {
        throw new Error("Method not implemented.");
    }
    deleteLevel(token: string, id: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    filterLevels(
        token: string,
        options?: { params: PaginationParams; filters: LevelFilter }
    ): Promise<PaginatedResult<Level>> {
        throw new Error("Method not implemented.");
    }
}
