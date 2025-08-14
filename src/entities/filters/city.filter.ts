import type { PaginationFilter } from "./pagination.filter";

/**
 * Filtres pour la recherche de villes (City)
 */
export interface CityFilter extends PaginationFilter {
    /** Nom exact */
    name?: string | null;
    /** Nom contenant */
    nameContains?: string | null;
    /** Nom commençant par */
    nameStartsWith?: string | null;
    /** Nom finissant par */
    nameEndsWith?: string | null;
    /** ID de la région */
    regionId?: number | null;
}
