import type { PaginationFilter } from "./pagination.filter";

/**
 * Filtres pour la recherche de types d'établissement (EstablishmentType)
 */
export interface EstablishmentTypeFilter extends PaginationFilter {
    /** Nom exact */
    name?: string | null;
    /** Nom contenant */
    nameContains?: string | null;
    /** Nom commençant par */
    nameStartsWith?: string | null;
    /** Nom finissant par */
    nameEndsWith?: string | null;
}
