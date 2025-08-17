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
    cityIds?: number[] | null;
    /** ID du type d'établissement */
    establishmentTypeIds?: number[] | null;
    /** ID du niveau */
    levelIds?: number[] | null;
    /** ID du domaine */
    domainIds?: number[] | null;
    /** ID de la mention */
    mentionIds?: number[] | null;
    /** Statut juridique */
    legalStatuses?: string[] | null;
    /** Acronyme exact */
    acronym?: string | null;
    /** Acronyme contenant */
    acronymContains?: string | null;
    /** Acronyme commençant par */
    acronymStartsWith?: string | null;
    /** Acronyme finissant par */
    acronymEndsWith?: string | null;
}
