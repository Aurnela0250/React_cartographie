/**
 * Type générique pour encapsuler les résultats des services
 * Permet une gestion uniforme des succès et erreurs
 */
export interface ServiceResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Helpers pour créer des ServiceResult
 */
export const ServiceResult = {
    success: <T>(data: T): ServiceResult<T> => ({
        success: true,
        data,
    }),

    error: <T>(error: string): ServiceResult<T> => ({
        success: false,
        error,
    }),
};