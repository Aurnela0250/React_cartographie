export class NotFoundError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class InputParseError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

// Error api Error
export class ApiError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class BadRequestError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class ConflictError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export class UnprocessableEntityError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}
export class InternalServerError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
    }
}

export interface ApiErrorDetail {
    field: string;
    message: string;
    code: string;
}

export interface ApiErrorResponse {
    message: string;
    details: ApiErrorDetail[];
}
