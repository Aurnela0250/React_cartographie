/**
 * Filtres de pagination communs à toutes les entités filtrables
 */
export interface PaginationFilter {
    /** Page de la pagination (défaut: 1) */
    page?: number;
    /** Nombre d'éléments par page (défaut: 10, max: 100) */
    perPage?: number;
}
