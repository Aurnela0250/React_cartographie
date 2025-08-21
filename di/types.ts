import { IEstablishmentRepository } from "@/core/interfaces/establishment.repository.interface";
import { IAuthRepository } from "@/src/application/repositories/auth.repository.interface";
import { ICitiesRepository } from "@/src/application/repositories/cities.repository.interface";
import { IDomainsRepository } from "@/src/application/repositories/domains.repository.interface";
import { IEstablishmentTypeRepository } from "@/src/application/repositories/establishment-type.repository.interface";
import { IFormationRepository } from "@/src/application/repositories/formation.repository.interface";
import { ILevelsRepository } from "@/src/application/repositories/levels.repository.interface";
import { IMentionsRepository } from "@/src/application/repositories/mention.repository.interface";
import { IRegionsRepository } from "@/src/application/repositories/region.repository.interface";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import { IGetUserInfoUseCase } from "@/src/application/use-cases/auth/get-user-info.use-case";
import { IRefreshTokenUseCase } from "@/src/application/use-cases/auth/refresh-token.use-case";
import { ISignInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { ISignOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { ISignUpUseCase } from "@/src/application/use-cases/auth/sign-up.use-case";
import { IFilterCitiesUseCase } from "@/src/application/use-cases/cities/filter-cities.use-case";
import { IGetCitiesUseCase } from "@/src/application/use-cases/cities/get-cities.use-case";
import { IGetDomainsUseCase } from "@/src/application/use-cases/domains/get-domains.use-case";
import { IGetEstablishmentTypesUseCase } from "@/src/application/use-cases/establishment-types/get-establishment-types.use-case";
import { IFilterEstablishmentsUseCase } from "@/src/application/use-cases/establishments/filter-establishment.use-case";
import { IGetEstablishmentUseCase } from "@/src/application/use-cases/establishments/get-establishment.use-case";
import { IFilterFormationsUseCase } from "@/src/application/use-cases/formations/filter-formations.use-case";
import { IGetFormationsUseCase } from "@/src/application/use-cases/formations/get-formations.use-case";
import { IGetLevelUseCase } from "@/src/application/use-cases/levels/get-level.use-case";
import { IGetLevelsUseCase } from "@/src/application/use-cases/levels/get-levels.use-case";
import { IGetMentionUseCase } from "@/src/application/use-cases/mentions/get-mention.use-case";
import { IGetRegionsUseCase } from "@/src/application/use-cases/regions/get-regions.use-case";
import { IGetUserInfoController } from "@/src/controllers/auth/get-user-info.controller";
import { IRefreshTokenController } from "@/src/controllers/auth/refresh-token.controller";
import { ISignInController } from "@/src/controllers/auth/sign-in.controller";
import { ISignOutController } from "@/src/controllers/auth/sign-out.controller";
import { ISignUpController } from "@/src/controllers/auth/sign-up.controller";
import { IFilterCitiesController } from "@/src/controllers/cities/filter-cities.controller";
import { IGetCitiesController } from "@/src/controllers/cities/get-cities.controller";
import { IGetDomainsController } from "@/src/controllers/domains/get-domains.controller";
import { IGetEstablishmentTypesController } from "@/src/controllers/establishment-types/get-establishment-types.controller";
import { IFilterEstablishmentsController } from "@/src/controllers/establishments/filter-establishments.controller";
import { IGetEstablishmentController } from "@/src/controllers/establishments/get-establishment.controller";
import { IFilterFormationsController } from "@/src/controllers/formations/filter-formations.controller";
import { IGetFormationsController } from "@/src/controllers/formations/get-formations.controller";
import { IGetLevelController } from "@/src/controllers/levels/get-level.controller";
import { IGetLevelsController } from "@/src/controllers/levels/get-levels.controller";
import { IGetMentionController } from "@/src/controllers/mentions/get-mention.controller";
import { IGetRegionsController } from "@/src/controllers/regions/get-regions.controller";

export const DI_SYMBOLS = {
    // Services
    IAuthService: Symbol.for("IAuthService"),

    // Repositories
    IAuthRepository: Symbol.for("IAuthRepository"),
    ICitiesRepository: Symbol.for("ICitiesRepository"),
    IDomainsRepository: Symbol.for("IDomainsRepository"),
    ILevelsRepository: Symbol.for("ILevelsRepository"),
    IRegionsRepository: Symbol.for("IRegionsRepository"),
    IEstablishmentRepository: Symbol.for("IEstablishmentRepository"),
    IEstablishmentTypeRepository: Symbol.for("IEstablishmentTypeRepository"),
    IMentionsRepository: Symbol.for("IMentionsRepository"),
    IFormationsRepository: Symbol.for("IFormationsRepository"),

    // Use cases
    //? Cities
    IGetCitiesUseCase: Symbol.for("IGetCitiesUseCase"),
    IFilterCitiesUseCase: Symbol.for("IFilterCitiesUseCase"),
    //? Domains
    IGetDomainsUseCase: Symbol.for("IGetDomainsUseCase"),
    //? Levels
    IGetLevelsUseCase: Symbol.for("IGetLevelsUseCase"),
    IGetLevelUseCase: Symbol.for("IGetLevelUseCase"),
    //? Regions
    IGetRegionsUseCase: Symbol.for("IGetRegionsUseCase"),
    //? Establishments
    IFilterEstablishmentsUseCase: Symbol.for("IFilterEstablishmentsUseCase"),
    IGetEstablishmentUseCase: Symbol.for("IGetEstablishmentUseCase"),
    //? Establishment Types
    IGetEstablishmentTypesUseCase: Symbol.for("IGetEstablishmentTypesUseCase"),
    //? Mentions
    IGetMentionUseCase: Symbol.for("IGetMentionUseCase"),
    //? Auth
    ISignInUseCase: Symbol.for("ISignInUseCase"),
    ISignUpUseCase: Symbol.for("ISignUpUseCase"),
    ISignOutUseCase: Symbol.for("ISignOutUseCase"),
    IRefreshTokenUseCase: Symbol.for("IRefreshTokenUseCase"),
    IGetUserInfoUseCase: Symbol.for("IGetUserInfoUseCase"),
    //? Formations
    IGetFormationsUseCase: Symbol.for("IGetFormationsUseCase"),
    IFilterFormationsUseCase: Symbol.for("IFilterFormationsUseCase"),

    // Controllers
    //? Cities
    IGetCitiesController: Symbol.for("IGetCitiesController"),
    IFilterCitiesController: Symbol.for("IFilterCitiesController"),
    //? Domains
    IGetDomainsController: Symbol.for("IGetDomainsController"),
    //? Levels
    IGetLevelsController: Symbol.for("IGetLevelsController"),
    IGetLevelController: Symbol.for("IGetLevelController"),
    //? Regions
    IGetRegionsController: Symbol.for("IGetRegionsController"),
    //? Establishments
    IFilterEstablishmentsController: Symbol.for(
        "IFilterEstablishmentsController"
    ),
    IGetEstablishmentController: Symbol.for("IGetEstablishmentController"),
    //? Establishment Types
    IGetEstablishmentTypesController: Symbol.for(
        "IGetEstablishmentTypesController"
    ),
    //? Mentions
    IGetMentionController: Symbol.for("IGetMentionController"),
    //? Auth
    ISignInController: Symbol.for("ISignInController"),
    ISignUpController: Symbol.for("ISignUpController"),
    ISignOutController: Symbol.for("ISignOutController"),
    IRefreshTokenController: Symbol.for("IRefreshTokenController"),
    IGetUserInfoController: Symbol.for("IGetUserInfoController"),
    //? Formations
    IGetFormationsController: Symbol.for("IGetFormationsController"),
    IFilterFormationsController: Symbol.for("IFilterFormationsController"),
};

export interface DI_RETURN_TYPES {
    // Services
    IAuthService: IAuthService;

    // Repositories
    IAuthRepository: IAuthRepository;
    ICitiesRepository: ICitiesRepository;
    IDomainsRepository: IDomainsRepository;
    ILevelsRepository: ILevelsRepository;
    IRegionsRepository: IRegionsRepository;
    IEstablishmentRepository: IEstablishmentRepository;
    IEstablishmentTypeRepository: IEstablishmentTypeRepository;
    IMentionsRepository: IMentionsRepository;
    IFormationRepository: IFormationRepository;

    // Use Cases
    //? Cities
    IGetCitiesUseCase: IGetCitiesUseCase;
    IFilterCitiesUseCase: IFilterCitiesUseCase;
    //? Domains
    IGetDomainsUseCase: IGetDomainsUseCase;
    //? Levels
    IGetLevelsUseCase: IGetLevelsUseCase;
    IGetLevelUseCase: IGetLevelUseCase;
    //? Regions
    IGetRegionsUseCase: IGetRegionsUseCase;
    //? Establishments
    IFilterEstablishmentsUseCase: IFilterEstablishmentsUseCase;
    IGetEstablishmentUseCase: IGetEstablishmentUseCase;
    //? Establishment Types
    IGetEstablishmentTypesUseCase: IGetEstablishmentTypesUseCase;
    //? Mentions
    IGetMentionUseCase: IGetMentionUseCase;
    //? Auth
    ISignInUseCase: ISignInUseCase;
    ISignUpUseCase: ISignUpUseCase;
    ISignOutUseCase: ISignOutUseCase;
    IRefreshTokenUseCase: IRefreshTokenUseCase;
    IGetUserInfoUseCase: IGetUserInfoUseCase;
    //? Formations
    IGetFormationsUseCase: IGetFormationsUseCase;
    IFilterFormationsUseCase: IFilterFormationsUseCase;

    // Controllers
    //? Cities
    IGetCitiesController: IGetCitiesController;
    IFilterCitiesController: IFilterCitiesController;
    //? Domains
    IGetDomainsController: IGetDomainsController;
    //? Levels
    IGetLevelsController: IGetLevelsController;
    IGetLevelController: IGetLevelController;
    //? Regions
    IGetRegionsController: IGetRegionsController;
    //? Establishments
    IFilterEstablishmentsController: IFilterEstablishmentsController;
    IGetEstablishmentController: IGetEstablishmentController;
    //? Establishment Types
    IGetEstablishmentTypesController: IGetEstablishmentTypesController;
    //? Mentions
    IGetMentionController: IGetMentionController;
    //? Auth
    ISignInController: ISignInController;
    ISignUpController: ISignUpController;
    ISignOutController: ISignOutController;
    IRefreshTokenController: IRefreshTokenController;
    IGetUserInfoController: IGetUserInfoController;
    //? Formations
    IGetFormationsController: IGetFormationsController;
    IFilterFormationsController: IFilterFormationsController;
}
