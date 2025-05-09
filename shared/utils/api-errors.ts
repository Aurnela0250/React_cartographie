import {
    ApiError,
    ApiErrorDetail,
    ApiErrorResponse,
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from "./api-errors.types";

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
            return new BadRequestError(message, details);
        case 401:
            return new UnauthorizedError(message, details);
        case 404:
            return new NotFoundError(message, details);
        case 409:
            return new ConflictError(
                "Une entité avec ces informations existe déjà.",
                details
            );
        // Ajoutez d'autres cas selon vos besoins
        default:
            return new ApiError(message, details, statusCode);
    }
}
