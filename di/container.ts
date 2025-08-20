import { DI_RETURN_TYPES, DI_SYMBOLS } from "@/di/types";
import { createContainer } from "@evyweb/ioctopus";

import { createAuthModule } from "./modules/auth.module";
import { createCitiesModule } from "./modules/cities.module";
import { createDomainsModule } from "./modules/domains.module";
import { createEstablishmentTypeModule } from "./modules/establishment-types.module";
import { createEstablishmentModule } from "./modules/establishment.module";
import { createFormationsModule } from "./modules/formations.module";
import { createLevelsModule } from "./modules/levels.module";
import { createMentionsModule } from "./modules/mentions.module";
import { createRegionsModule } from "./modules/regions.module";

const ApplicationContainer = createContainer();

ApplicationContainer.load(Symbol("CitiesModule"), createCitiesModule());
ApplicationContainer.load(Symbol("DomainsModule"), createDomainsModule());
ApplicationContainer.load(Symbol("LevelsModule"), createLevelsModule());
ApplicationContainer.load(Symbol("RegionsModule"), createRegionsModule());
ApplicationContainer.load(
    Symbol("EstablishmentModule"),
    createEstablishmentModule()
);
ApplicationContainer.load(
    Symbol("EstablishmentTypeModule"),
    createEstablishmentTypeModule()
);
ApplicationContainer.load(Symbol("FormationsModule"), createFormationsModule());
ApplicationContainer.load(Symbol("MentionsModule"), createMentionsModule());
ApplicationContainer.load(Symbol("AuthModule"), createAuthModule());

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
    symbol: K
): DI_RETURN_TYPES[K] {
    return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}
