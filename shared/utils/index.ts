import { camelCase, snakeCase } from "change-case";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { UnauthorizedError } from "@/src/entities/errors/auth";
import {
    ApiError,
    ApiErrorDetail,
    ApiErrorResponse,
    BadRequestError,
    ConflictError,
    NotFoundError,
} from "@/src/entities/errors/common";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper function to check if a value is a plain object
function isObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === "[object Object]";
}

/**
 * Recursively converts object keys to camelCase.
 * Handles nested objects and arrays.
 * @param obj The object or array to transform.
 * @returns The transformed object or array with camelCase keys.
 */
export function toCamelCaseRecursive<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(toCamelCaseRecursive) as T;
    }

    if (isObject(obj)) {
        const newObj: Record<string, unknown> = {};

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const camelKey = camelCase(key);

                newObj[camelKey] = toCamelCaseRecursive(obj[key]);
            }
        }

        return newObj as T;
    }

    return obj;
}

/**
 * Recursively converts object keys to snake_case.
 * Handles nested objects and arrays.
 * @param obj The object or array to transform.
 * @returns The transformed object or array with snake_case keys.
 */
export function toSnakeCaseRecursive<T>(obj: T): T {
    if (Array.isArray(obj)) {
        return obj.map(toSnakeCaseRecursive) as T;
    }

    if (isObject(obj)) {
        const newObj: Record<string, unknown> = {};

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const snakeKey = snakeCase(key);

                newObj[snakeKey] = toSnakeCaseRecursive(obj[key]);
            }
        }

        return newObj as T;
    }

    return obj;
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
        // Vérifier si la réponse a un statut 204 (No Content)
        if (response.status === 204) {
            return undefined as T; // Pas de contenu à parser
        }

        return (await response.json()) as T;
    }

    let errorData: ApiErrorResponse;

    try {
        errorData = (await response.json()) as ApiErrorResponse;
    } catch (e) {
        throw createErrorByStatusCode(
            response.status,
            `Erreur HTTP: ${response.status} ${response.statusText}`,
            []
        );
    }

    throw createErrorByStatusCode(
        response.status,
        errorData.message || `Erreur HTTP: ${response.status}`,
        errorData.details || []
    );
}

function createErrorByStatusCode(
    statusCode: number,
    message: string,
    details: ApiErrorDetail[]
): ApiError {
    switch (statusCode) {
        case 400:
            return new BadRequestError(message);
        case 401:
            return new UnauthorizedError(message);
        case 404:
            return new NotFoundError(message);
        case 409:
            return new ConflictError(message);
        // Ajoutez d'autres cas selon vos besoins
        default:
            return new ApiError(message);
    }
}
