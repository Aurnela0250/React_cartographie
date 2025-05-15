import { Formation } from "@/core/entities/formation.entity";
import { PaginatedResult, PaginationParams } from "@/core/entities/pagination";

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
            intitule?: string;
            description?: string;
            duration?: number;
            levelId?: number;
            mentionId?: number;
            establishmentId?: number;
            authorizationId?: number;
        }
    ): Promise<Formation>;
    delete(token: string, id: number): Promise<boolean>;
    createFormationAuthorization(
        token: string,
        formationId: number,
        data: {
            dateDebut: string;
            dateFin?: string;
            status: "REQUESTED" | "VALIDATED" | "REFUSED" | "EXPIRED";
            arrete: string;
        }
    ): Promise<Formation>;
    updateFormationAuthorization(
        token: string,
        formationId: number,
        data: {
            dateDebut?: string;
            dateFin?: string;
            status?: "REQUESTED" | "VALIDATED" | "REFUSED" | "EXPIRED";
            arrete?: string;
        }
    ): Promise<Formation>;
    createFormationAnnualHeadCount(
        token: string,
        formationId: number,
        data: {
            academicYear: number;
            students: number;
        }
    ): Promise<Formation>;
    updateFormationAnnualHeadCount(
        token: string,
        formationId: number,
        id: number,
        data: {
            academicYear?: number;
            students?: number;
        }
    ): Promise<Formation>;
    deleteFormationAnnualHeadCount(
        token: string,
        formationId: number,
        id: number
    ): Promise<boolean>;
}
