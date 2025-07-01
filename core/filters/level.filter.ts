import type { PaginationFilter } from "./pagination.filter";

/**
 * Filtres pour la recherche de niveaux (Level)
 */
export interface LevelFilter extends PaginationFilter {
    /** Nom exact */
    name?: string | null;
    /** Nom contenant */
    nameContains?: string | null;
    /** Nom commençant par */
    nameStartsWith?: string | null;
    /** Nom finissant par */
    nameEndsWith?: string | null;
    /** Acronyme exact */
    acronym?: string | null;
    /** Acronyme contenant */
    acronymContains?: string | null;
    /** Acronyme commençant par */
    acronymStartsWith?: string | null;
    /** Acronyme finissant par */
    acronymEndsWith?: string | null;
}
