import { getDomainsUseCase } from "@/src/application/use-cases/domains/get-domains.use-case";
import { getDomainsController } from "@/src/controllers/domains/get-domains.controller";
import { DomainsRepository } from "@/src/infrastructure/repositories/domains.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createDomainsModule = () => {
    const domainsModule = createModule();

    domainsModule
        .bind(DI_SYMBOLS.IDomainsRepository)
        .toClass(DomainsRepository);

    domainsModule
        .bind(DI_SYMBOLS.IGetDomainsUseCase)
        .toHigherOrderFunction(getDomainsUseCase, [
            DI_SYMBOLS.IDomainsRepository,
        ]);

    domainsModule
        .bind(DI_SYMBOLS.IGetDomainsController)
        .toHigherOrderFunction(getDomainsController, [
            DI_SYMBOLS.IGetDomainsUseCase,
        ]);

    return domainsModule;
};
