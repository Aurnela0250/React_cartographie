// src/utils/errors.ts

export class AppError extends Error {
    constructor(
        public status_code: number,
        public detail: any,
        public headers?: Record<string, any>
    ) {
        super(typeof detail === "string" ? detail : JSON.stringify(detail));
        this.name = this.constructor.name;
    }
}

export class BadRequestError extends AppError {
    constructor(detail: any = null, headers?: Record<string, any>) {
        super(400, detail, headers);
    }
}

export class UnauthorizedError extends AppError {
    constructor(detail: any = "Unauthorized", headers?: Record<string, any>) {
        super(401, detail, headers);
    }
}

export class ForbiddenError extends AppError {
    constructor(detail: any = "Forbidden", headers?: Record<string, any>) {
        super(403, detail, headers);
    }
}

export class NotFoundError extends AppError {
    constructor(detail: any = "Not found", headers?: Record<string, any>) {
        super(404, detail, headers);
    }
}

export class ConflictError extends AppError {
    constructor(detail: any = "Conflict", headers?: Record<string, any>) {
        super(409, detail, headers);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(detail: any = null, headers?: Record<string, any>) {
        super(422, detail, headers);
    }
}

export class InternalServerError extends AppError {
    constructor(
        detail: any = "Internal server error",
        headers?: Record<string, any>
    ) {
        super(500, detail, headers);
    }
}

export class InvalidCredentialError extends AppError {
    constructor(
        detail: any = "Invalid credentials",
        headers?: Record<string, any>
    ) {
        super(401, detail, headers);
    }
}

export class EntityError<T> {
    static notFound<T>(
        model: new () => T,
        identifier?: string | number | null
    ): NotFoundError {
        const detail = `${model.name} not found${
            identifier ? ` with identifier: ${identifier}` : ""
        }`;
        return new NotFoundError(detail);
    }

    static alreadyExists<T>(
        model: new () => T,
        identifier?: string | number | null
    ): ConflictError {
        const detail = `${model.name} already exists${
            identifier ? ` with identifier: ${identifier}` : ""
        }`;
        return new ConflictError(detail);
    }
}

export class ValidationError extends UnprocessableEntityError {
    constructor(public errorDetails: any) {
        super({ message: "Erreur de validation", errors: errorDetails });
    }

    errors() {
        return this.errorDetails;
    }

    static formatted(errors: any) {
        const formattedErrors = formatValidationErrors(errors);
        return new ValidationError(formattedErrors);
    }
}

// Les autres classes d'erreur restent inchangées

// Fonction utilitaire pour formater les erreurs de validation
function formatValidationErrors(errors: any): any {
    // Implémentez la logique de formatage ici
    return errors;
}
