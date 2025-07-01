import type { PaginationFilter } from "./pagination.filter";

/**
 * Filtres pour la recherche d'établissements (Establishment)
 */
export interface EstablishmentFilter extends PaginationFilter {
    /** Nom exact */
    name?: string | null;
    /** Nom contenant */
    nameContains?: string | null;
    /** Nom commençant par */
    nameStartsWith?: string | null;
    /** Nom finissant par */
    nameEndsWith?: string | null;
    /** ID de la ville */
    cityId?: number | null;
}
