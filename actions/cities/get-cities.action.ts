// "use server";
// /**
//  * Récupère toutes les villes avec pagination
//  */
// export const getCitiesAction = async (
//     paginationParams: PaginationParams
// ): Promise<ServiceResult<City[]>> => {
//     try {
//         // Vérification de l'authentification
//         const sessionResult = await verifySession();

//         if (!sessionResult.isAuthenticated) {
//             return ServiceResult.error(
//                 sessionResult.error || "Utilisateur non authentifié"
//             );
//         }

//         // Vérification des permissions
//         const permissionResult = await checkUserPermission("READ");

//         if (!permissionResult.success) {
//             return ServiceResult.error(permissionResult.error!);
//         }

//         if (!permissionResult.data) {
//             return ServiceResult.error("Permission de lecture requise");
//         }

//         // Récupération des villes
//         const cityRepository = new CityApiRepository();
//         const citiesResult = await cityRepository.getAll(
//             sessionResult.accessToken!,
//             paginationParams
//         );

//         return ServiceResult.success(citiesResult.items);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des villes:", error);

//         const errorMessage =
//             error instanceof Error
//                 ? error.message
//                 : "Erreur lors du chargement des villes";

//         return ServiceResult.error(errorMessage);
//     }
// };
