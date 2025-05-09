import { camelCase, snakeCase } from "change-case";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
