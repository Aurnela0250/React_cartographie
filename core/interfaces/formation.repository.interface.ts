import { Formation } from "@/core/domain/entities/formation.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "@/core/domain/entities/pagination";

export interface IFormationRepository {
    getAll(
        token: string,
        param: PaginationParams
    ): Promise<PaginatedResult<Formation>>;
    get(token: string, id: number): Promise<Formation>;
    create(
        token: string,
        data: {
            intitule: string;
            description?: string;
            duration: number;
            level_id: number;
            mention_id: number;
            establishment_id: number;
            authorization_id?: number;
        }
    ): Promise<Formation>;
    update(
        token: string,
        id: number,
        data: {
            intitule?: string;
            description?: string;
            duration?: number;
            level_id?: number;
            mention_id?: number;
            establishment_id?: number;
            authorization_id?: number;
        }
    ): Promise<Formation>;
    delete(token: string, id: number): Promise<boolean>;
    createFormationAuthorization(
        token: string,
        id: number,
        data: {
            date_debut: string;
            date_fin?: string;
            status: "REQUESTED" | "VALIDATED" | "REFUSED" | "EXPIRED";
            arrete: string;
        }
    ): Promise<Formation>;
    updateFormationAuthorization(
        token: string,
        id: number,
        data: {
            date_debut?: string;
            date_fin?: string;
            status?: "REQUESTED" | "VALIDATED" | "REFUSED" | "EXPIRED";
            arrete?: string;
        }
    ): Promise<Formation>;
    createFormationAnnualHeadCount(
        token: string,
        id: number,
        data: {
            academic_year: number;
            students: number;
        }
    ): Promise<Formation>;
    updateFormationAnnualHeadCount(
        token: string,
        id: number,
        data: {
            academic_year?: number;
            students?: number;
        }
    ): Promise<Formation>;
    deleteFormationAnnualHeadCount(
        token: string,
        id: number
    ): Promise<Formation>;
}
