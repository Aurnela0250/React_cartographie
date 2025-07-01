import { Formation } from "@/core/entities/formation.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";

import { FormationFilter } from "../filters/formation.filter";

export interface IFormationRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Formation>>;
    get(token: string, id: number): Promise<Formation>;
    create(
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
    ): Promise<Formation>;
    update(
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
    ): Promise<Formation>;
    delete(token: string, id: number): Promise<void>;
    filter(
        token: string,
        filters: FormationFilter
    ): Promise<PaginatedResult<Formation>>;
}
