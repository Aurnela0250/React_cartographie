import { DI_RETURN_TYPES, DI_SYMBOLS } from "@/di/types";
import { createContainer } from "@evyweb/ioctopus";

import { createCitiesModule } from "./modules/cities.module";
import { createDomainsModule } from "./modules/domains.module";
import { createLevelsModule } from "./modules/levels.module";
import { createRegionsModule } from "./modules/regions.module";

const ApplicationContainer = createContainer();

ApplicationContainer.load(Symbol("CitiesModule"), createCitiesModule());
ApplicationContainer.load(Symbol("DomainsModule"), createDomainsModule());
ApplicationContainer.load(Symbol("LevelsModule"), createLevelsModule());
ApplicationContainer.load(Symbol("RegionsModule"), createRegionsModule());

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
    symbol: K
): DI_RETURN_TYPES[K] {
    return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}
