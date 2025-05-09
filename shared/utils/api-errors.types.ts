export interface ApiErrorDetail {
    field: string;
    message: string;
    code: string;
}

export interface ApiErrorResponse {
    message: string;
    details: ApiErrorDetail[];
}

export class ApiError extends Error {
    readonly statusCode: number;
    readonly details: ApiErrorDetail[];

    constructor(
        message: string,
        details: ApiErrorDetail[] = [],
        statusCode = 500
    ) {
        super(message);
        this.name = "ApiError";
        this.details = details;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    // Méthode utile pour vérifier si une erreur concerne un champ spécifique
    hasFieldError(field: string): boolean {
        return this.details.some((detail) => detail.field === field);
    }

    // Récupérer tous les messages d'erreur pour un champ
    getFieldErrors(field: string): string[] {
        return this.details
            .filter((detail) => detail.field === field)
            .map((detail) => detail.message);
    }
}

// Erreurs spécifiques selon les codes HTTP
export class BadRequestError extends ApiError {
    constructor(message: string, details: ApiErrorDetail[] = []) {
        super(message, details, 400);
        this.name = "BadRequestError";
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string, details: ApiErrorDetail[] = []) {
        super(message, details, 401);
        this.name = "UnauthorizedError";
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string, details: ApiErrorDetail[] = []) {
        super(message, details, 404);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

// Vous pouvez ajouter d'autres erreurs selon vos besoins (403, 409, 422, etc.)
export class ConflictError extends ApiError {
    constructor(
        message: string = "Conflit de ressources : l'entité existe déjà",
        details: ApiErrorDetail[] = []
    ) {
        super(message, details, 409);
        this.name = "ConflictError";
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

export class InternalServerError extends ApiError {
    constructor(message: string, details: ApiErrorDetail[] = []) {
        super(message, details, 500);
        this.name = "InternalServerError";
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}
