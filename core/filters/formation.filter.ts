import type { PaginationFilter } from "./pagination.filter";

/**
 * Filtres pour la recherche de formations (Formation)
 */
export interface FormationFilter extends PaginationFilter {
    /** Nom exact */
    name?: string | null;
    /** Nom contenant */
    nameContains?: string | null;
    /** Nom commençant par */
    nameStartsWith?: string | null;
    /** Nom finissant par */
    nameEndsWith?: string | null;
}
