import type { PaginationFilter } from "./pagination.filter";

/**
 * Filtres pour la recherche de régions (Region)
 */
export interface RegionFilter extends PaginationFilter {
    /** ID exact */
    id?: number | null;
    /** Nom exact */
    name?: string | null;
    /** Nom contenant */
    nameContains?: string | null;
    /** Nom commençant par */
    nameStartsWith?: string | null;
    /** Nom finissant par */
    nameEndsWith?: string | null;
    /** Créé par (user id) */
    createdBy?: number | null;
    /** Modifié par (user id) */
    updatedBy?: number | null;
}
