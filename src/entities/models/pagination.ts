export interface PaginationParams {
    /** Numéro de page (débute à 1) – défaut : 1 */
    page?: number;
    /** Nombre d’éléments par page (1-100) – défaut : 10 */
    perPage?: number;
}

/** Interface pour les classes d’entité avec méthode statique fromUnknown */
export interface HasFromUnknown<E> {
    fromUnknown(data: unknown): E;
}

/** Forme brute (objet JSON ou littéral) attendue */
export type PaginatedPlain<U> = {
    items: U[];
    totalItems: number;
    page: number;
    perPage: number;
    totalPages: number;
    nextPage?: number;
    previousPage?: number;
};

export class PaginatedResult<T> {
    constructor(
        public items: T[],
        public totalItems: number,
        public page: number,
        public perPage: number,
        public totalPages: number,
        public nextPage?: number,
        public previousPage?: number
    ) {}

    /**
     * Crée une instance à partir d’un objet littéral (plain object).
     * @param obj Objet brut conforme à PaginatedPlain<U>
     */
    static fromPlain<U>(obj: PaginatedPlain<U>): PaginatedResult<U> {
        return new PaginatedResult<U>(
            obj.items,
            obj.totalItems,
            obj.page,
            obj.perPage,
            obj.totalPages,
            obj.nextPage,
            obj.previousPage
        );
    }

    /**
     * Crée une instance à partir d’un JSON (string ou objet).
     * @param json Chaîne JSON ou objet brut
     * @param entityCtor Classe d’entité avec méthode fromUnknown
     * @param itemConverter Fonction optionnelle de conversion d’un item
     */
    static fromJson<U, E>(
        json: string | PaginatedPlain<U>,
        entityCtor: HasFromUnknown<E>,
        itemConverter?: (item: U) => E
    ): PaginatedResult<E> {
        const raw: PaginatedPlain<U> =
            typeof json === "string" ? JSON.parse(json) : json;

        const {
            items,
            totalItems,
            page,
            perPage,
            totalPages,
            nextPage,
            previousPage,
        } = raw;

        const convert =
            itemConverter ??
            ((item: U) => entityCtor.fromUnknown(item as unknown));

        return new PaginatedResult<E>(
            items.map(convert),
            totalItems,
            page,
            perPage,
            totalPages,
            nextPage,
            previousPage
        );
    }

    /**
     * Convertit un PaginatedResult<U> en PaginatedResult<E> en transformant les items.
     * @param result Résultat paginé source
     * @param entityCtor Classe d’entité avec méthode fromUnknown
     * @param itemConverter Fonction optionnelle de conversion d’un item
     */
    static mapItemsToEntity<U, E>(
        result: PaginatedResult<U>,
        entityCtor: HasFromUnknown<E>,
        itemConverter?: (item: U) => E
    ): PaginatedResult<E> {
        const convert =
            itemConverter ??
            ((item: U) => entityCtor.fromUnknown(item as unknown));

        return new PaginatedResult<E>(
            result.items.map(convert),
            result.totalItems,
            result.page,
            result.perPage,
            result.totalPages,
            result.nextPage,
            result.previousPage
        );
    }
}
