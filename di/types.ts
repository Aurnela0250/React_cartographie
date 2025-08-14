import { ICitiesRepository } from "@/src/application/repositories/cities.repository.interface";
import { IDomainsRepository } from "@/src/application/repositories/domains.repository.interface";
import { ILevelsRepository } from "@/src/application/repositories/levels.repository.interface";
import { IRegionsRepository } from "@/src/application/repositories/region.repository.interface";
import { IAuthService } from "@/src/application/services/auth.service.interface";
import { IGetCitiesUseCase } from "@/src/application/use-cases/cities/get-cities.use-case";
import { IGetDomainsUseCase } from "@/src/application/use-cases/domains/get-domains.use-case";
import { IGetLevelsUseCase } from "@/src/application/use-cases/levels/get-levels.use-case";
import { IGetRegionsUseCase } from "@/src/application/use-cases/regions/get-regions.use-case";
import { IGetCitiesController } from "@/src/controllers/cities/get-cities.controller";
import { IGetDomainsController } from "@/src/controllers/domains/get-domains.controller";
import { IGetLevelsController } from "@/src/controllers/levels/get-levels.controller";
import { IGetRegionsController } from "@/src/controllers/regions/get-regions.controller";

export const DI_SYMBOLS = {
    // Services
    IAuthService: Symbol.for("IAuthService"),

    // Repositories
    ICitiesRepository: Symbol.for("ICitiesRepository"),
    IDomainsRepository: Symbol.for("IDomainsRepository"),
    ILevelsRepository: Symbol.for("ILevelsRepository"),
    IRegionsRepository: Symbol.for("IRegionsRepository"),

    // Use cases
    IGetCitiesUseCase: Symbol.for("IGetCitiesUseCase"),
    IGetDomainsUseCase: Symbol.for("IGetDomainsUseCase"),
    IGetLevelsUseCase: Symbol.for("IGetLevelsUseCase"),
    IGetRegionsUseCase: Symbol.for("IGetRegionsUseCase"),

    // Controllers
    IGetCitiesController: Symbol.for("IGetCitiesController"),
    IGetDomainsController: Symbol.for("IGetDomainsController"),
    IGetLevelsController: Symbol.for("IGetLevelsController"),
    IGetRegionsController: Symbol.for("IGetRegionsController"),
};

export interface DI_RETURN_TYPES {
    // Services
    IAuthService: IAuthService;

    // Repositories
    ICitiesRepository: ICitiesRepository;
    IDomainsRepository: IDomainsRepository;
    ILevelsRepository: ILevelsRepository;
    IRegionsRepository: IRegionsRepository;

    // Use Cases
    IGetCitiesUseCase: IGetCitiesUseCase;
    IGetDomainsUseCase: IGetDomainsUseCase;
    IGetLevelsUseCase: IGetLevelsUseCase;
    IGetRegionsUseCase: IGetRegionsUseCase;

    // Controllers
    IGetCitiesController: IGetCitiesController;
    IGetDomainsController: IGetDomainsController;
    IGetLevelsController: IGetLevelsController;
    IGetRegionsController: IGetRegionsController;
}
