/**
 * HTTP Status Codes
 */
export enum HttpStatus {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

/**
 * Type for error details
 */
export type ErrorDetails = Record<string, any> | undefined;

/**
 * Base API Error class
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: ErrorDetails
    ) {
        super(message);
        this.name = this.constructor.name;

        // This is needed for proper instanceof checks in TypeScript with extended Error classes
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

/**
 * 400 - Bad Request Errors
 */
export class BadRequestError extends ApiError {
    constructor(
        message: string = "Requête incorrecte",
        details?: ErrorDetails
    ) {
        super(HttpStatus.BAD_REQUEST, message, details);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class ValidationError extends BadRequestError {
    constructor(
        message: string = "Erreur de validation",
        details?: ErrorDetails
    ) {
        super(message, details);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * 401 - Authentication Errors
 */
export class AuthenticationError extends ApiError {
    constructor(
        message: string = "Erreur d'authentification",
        details?: ErrorDetails
    ) {
        super(HttpStatus.UNAUTHORIZED, message, details);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

export class InvalidCredentialsError extends AuthenticationError {
    constructor(details?: ErrorDetails) {
        super("Identifiants invalides", details);
        Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    }
}

export class InvalidTokenError extends AuthenticationError {
    constructor(details?: ErrorDetails) {
        super("Token invalide ou expiré", details);
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
    }
}

/**
 * 403 - Forbidden Errors
 */
export class ForbiddenError extends ApiError {
    constructor(message: string = "Accès interdit", details?: ErrorDetails) {
        super(HttpStatus.FORBIDDEN, message, details);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

export class AuthorizationError extends ForbiddenError {
    constructor(details?: ErrorDetails) {
        super("Autorisation refusée", details);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}

/**
 * 404 - Not Found Error
 */
export class NotFoundError extends ApiError {
    constructor(resource: string, details?: ErrorDetails) {
        super(
            HttpStatus.NOT_FOUND,
            `La ressource ${resource} n'a pas été trouvée`,
            details
        );
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * 409 - Conflict Error
 */
export class ConflictError extends ApiError {
    constructor(
        message: string = "Conflit de ressources",
        details?: ErrorDetails
    ) {
        super(HttpStatus.CONFLICT, message, details);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

/**
 * 422 - Unprocessable Entity Error
 */
export class UnprocessableEntityError extends ApiError {
    constructor(
        message: string = "Entité non traitable",
        details?: ErrorDetails
    ) {
        super(HttpStatus.UNPROCESSABLE_ENTITY, message, details);
        Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
    }
}

/**
 * 500 - Internal Server Errors
 */
export class InternalServerError extends ApiError {
    constructor(
        message: string = "Erreur interne du serveur",
        details?: ErrorDetails
    ) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, message, details);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}

export class ServiceUnavailableError extends ApiError {
    constructor(
        message: string = "Service indisponible",
        details?: ErrorDetails
    ) {
        super(HttpStatus.SERVICE_UNAVAILABLE, message, details);
        Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
    }
}

export class DatabaseError extends InternalServerError {
    constructor(details?: ErrorDetails) {
        super("Erreur de base de données", details);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export class ExternalServiceError extends InternalServerError {
    constructor(details?: ErrorDetails) {
        super("Erreur de service externe", details);
        Object.setPrototypeOf(this, ExternalServiceError.prototype);
    }
}

/**
 * Interface for formatted validation errors
 */
export interface FormattedValidationError {
    message: string;
    errors?: Record<string, any>;
}

/**
 * Utility function to format validation errors
 * @param errors - The validation errors to format
 * @returns A formatted error object
 */
export function formatValidationErrors(
    errors: unknown
): FormattedValidationError {
    // Handle null or undefined
    if (errors == null) {
        return { message: "Erreur inconnue" };
    }

    // Handle string errors
    if (typeof errors === "string") {
        return { message: errors };
    }

    // Handle object errors
    if (typeof errors === "object") {
        return {
            message: "Erreur de validation",
            errors: errors as Record<string, any>,
        };
    }

    // Handle any other type
    return {
        message: "Erreur de validation",
        errors: { value: String(errors) },
    };
}
