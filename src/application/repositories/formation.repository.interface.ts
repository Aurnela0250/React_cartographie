import { FormationFilter } from "@/src/entities/filters/formation.filter";
import { Formation } from "@/src/entities/models/formation.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/src/entities/models/pagination";

export interface IFormationRepository {
    getFormations(
        token: string,
        options?: {
            params?: PaginationParams;
        }
    ): Promise<PaginatedResult<Formation>>;
    getFormation(token: string, id: number): Promise<Formation>;
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
    ): Promise<Formation>;
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
    ): Promise<Formation>;
    deleteFormation(token: string, id: number): Promise<boolean>;
    filterFormations(
        token: string,
        options?: {
            params?: PaginationParams;
            filters?: FormationFilter;
        }
    ): Promise<PaginatedResult<Formation>>;
}
