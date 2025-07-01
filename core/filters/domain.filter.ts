import { PaginationFilter } from "./pagination.filter";

/**
 * Filtres pour la recherche de domaines (Domain)
 */
export interface DomainFilter extends PaginationFilter {
    /** Nom exact */
    name?: string | null;
    /** Nom contenant */
    nameContains?: string | null;
    /** Nom commençant par */
    nameStartsWith?: string | null;
    /** Nom finissant par */
    nameEndsWith?: string | null;
}
