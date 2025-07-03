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
    /** Description exacte */
    description?: string | null;
    /** Description contenant */
    descriptionContains?: string | null;
    /** Durée exacte de la formation */
    duration?: number | null;
    /** Durée minimum de la formation */
    durationMin?: number | null;
    /** Durée maximum de la formation */
    durationMax?: number | null;

    /** ID du niveau de la formation */
    levelId?: number | null;
    /** ID de la mention de la formation */
    mentionId?: number | null;
    /** ID de l'établissement de la formation */
    establishmentId?: number | null;
    /** ID de l'autorisation de la formation */
    authorizationId?: number | null;

    /** ID de l'utilisateur qui a créé la formation */
    createdBy?: number | null;
    /** ID de l'utilisateur qui a modifié la formation en dernier */
    updatedBy?: number | null;

    /** Formations créées après cette date */
    createdAtAfter?: Date | null;
    /** Formations créées avant cette date */
    createdAtBefore?: Date | null;
    /** Formations modifiées après cette date */
    updatedAtAfter?: Date | null;
    /** Formations modifiées avant cette date */
    updatedAtBefore?: Date | null;
}
