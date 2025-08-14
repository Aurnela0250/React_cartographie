# Phase 2a - Plan d'Exécution Immédiat

## 🚀 Actions Next 48h - Region Completion

### Étape 1 : Créer Repository Region (30 min)

```typescript
// /src/infrastructure/repositories/regions.repository.ts
import { ServiceResult } from "@/shared/types/service-result";
import { PaginationParams } from "@/src/entities/filters/pagination.filter";
import { RegionFilter } from "@/src/entities/filters/region.filter";
import { Region } from "@/src/entities/models/region.entity";
import { Pagination } from "@/src/entities/models/pagination";
import { IRegionsRepository } from "@/src/application/repositories/region.repository.interface";

export class RegionsRepository implements IRegionsRepository {
    private readonly baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    async getAll(
        accessToken: string,
        params: PaginationParams<RegionFilter>
    ): Promise<ServiceResult<Pagination<Region>>> {
        // Implementation similaire à CitiesRepository
    }

    async getById(
        accessToken: string,
        id: number
    ): Promise<ServiceResult<Region>> {
        // Implementation
    }

    // ... autres méthodes CRUD
}
```

### Étape 2 : Créer Controller Region (20 min)

```typescript
// /src/controllers/regions/get-regions.controller.ts
import { GetRegionsUseCase } from "@/src/application/use-cases/regions/get-regions.use-case";
import { PaginationParams } from "@/src/entities/filters/pagination.filter";
import { RegionFilter } from "@/src/entities/filters/region.filter";

export type GetRegionsControllerParams = PaginationParams<RegionFilter>;
export type GetRegionsController = (
    accessToken: string | undefined,
    params: GetRegionsControllerParams
) => ReturnType<GetRegionsUseCase>;

export const createGetRegionsController = (
    getRegionsUseCase: GetRegionsUseCase
): GetRegionsController => {
    return async (accessToken, params) => {
        return await getRegionsUseCase(accessToken, params);
    };
};
```

### Étape 3 : Module DI Region (15 min)

```typescript
// /di/modules/regions.module.ts
import { createGetRegionsController } from "@/src/controllers/regions/get-regions.controller";
import { GetRegionsUseCase } from "@/src/application/use-cases/regions/get-regions.use-case";
import { RegionsRepository } from "@/src/infrastructure/repositories/regions.repository";
import { DI_SYMBOLS } from "@/di/types";
import { createModule } from "@evyweb/ioctopus";

export const createRegionsModule = () =>
    createModule((builder) => {
        // Repository
        builder
            .bind(DI_SYMBOLS.IRegionsRepository)
            .toClass(RegionsRepository);

        // Use Cases
        builder
            .bind(DI_SYMBOLS.GetRegionsUseCase)
            .toFactory((container) => {
                const repository = container.get(DI_SYMBOLS.IRegionsRepository);
                return new GetRegionsUseCase(repository);
            });

        // Controllers
        builder
            .bind(DI_SYMBOLS.IGetRegionsController)
            .toFactory((container) => {
                const useCase = container.get(DI_SYMBOLS.GetRegionsUseCase);
                return createGetRegionsController(useCase);
            });
    });
```

### Étape 4 : Hook TanStack Query (25 min)

```typescript
// /presentation/hooks/use-regions.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getInjection } from "@/di/container";
import { PaginationParams } from "@/src/entities/filters/pagination.filter";
import { RegionFilter } from "@/src/entities/filters/region.filter";
import { Region } from "@/src/entities/models/region.entity";
import { Pagination } from "@/src/entities/models/pagination";
import { ServiceResult } from "@/shared/types/service-result";

export type UseRegionsParams = PaginationParams<RegionFilter>;

export const useRegions = (
    params: UseRegionsParams,
    options?: UseQueryOptions<ServiceResult<Pagination<Region>>>
) => {
    const getRegionsController = getInjection("IGetRegionsController");

    return useQuery({
        queryKey: ["regions", params],
        queryFn: async () => {
            // Récupérer token depuis cookies ou context
            const accessToken = ""; // À adapter selon votre auth
            return await getRegionsController(accessToken, params);
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        ...options,
    });
};
```

### Étape 5 : Route API Migration (20 min)

```typescript
// /app/api/regions/route.ts - Migrer vers nouvelle architecture
import { NextResponse } from "next/server";
import { getInjection } from "@/di/container";
import {
    apiAuthWrapper,
    AuthenticatedRequest,
} from "@/infrastructure/services/api-auth-wrapper.service";

async function handleGet(request: AuthenticatedRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page") || 1);
        const perPage = Number(searchParams.get("per_page") || 10);

        const getRegionsController = getInjection("IGetRegionsController");
        
        const data = await getRegionsController(request.accessToken, {
            params: { page, perPage }
        });

        return NextResponse.json(data);
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
        return NextResponse.json({ message: errorMsg }, { status: 500 });
    }
}

export const GET = apiAuthWrapper.createProtectedHandler(handleGet);
```

## 🎯 Checklist Validation Region

### Tests Techniques
- [ ] `npm run build` - 0 erreur
- [ ] `npm run typecheck` - 0 erreur TypeScript
- [ ] Route `/api/regions` répond correctement
- [ ] Hook `useRegions` retourne data
- [ ] DI resolve correctement `IGetRegionsController`

### Tests Fonctionnels
- [ ] Page admin `/admin/regions` charge
- [ ] Liste des régions s'affiche
- [ ] Pagination fonctionne
- [ ] Pas de régression sur `/admin/cities` (dépendance Region)

## 🚀 Phase 2a.2 - EstablishmentType (Next 48h)

### Analyse Pré-Migration
```bash
# Identifier tous les usages actuels
grep -r "EstablishmentType\|establishment-type" --include="*.ts" --include="*.tsx" .
grep -r "establishmentTypeId" --include="*.ts" --include="*.tsx" .
```

### Template Migration EstablishmentType

1. **Entité** (déjà existe dans `/src/entities/models/`) ✅
2. **Interface Repository** - À créer
3. **Use Case** - À créer  
4. **Repository Implementation** - À créer
5. **Controller** - À créer
6. **Module DI** - À créer
7. **Hook TanStack Query** - À créer
8. **Route API** - Migrer existante

### Ordre d'Exécution EstablishmentType
1. Interface Repository (10 min)
2. Use Case (15 min)
3. Repository Implementation (30 min)
4. Controller (15 min)
5. Module DI (20 min)
6. Hook TanStack Query (20 min)
7. Migration Route API (15 min)
8. Tests et validation (30 min)

**Total estimé : 2h45min**

## ⚠️ Points de Vigilance

### Region
- Vérifier relation `City.regionId → Region.id`
- Tester composant `CitySelector` (utilise regions)
- Cache invalidation entre Cities et Regions

### EstablishmentType  
- Relation `Establishment.establishmentTypeId → EstablishmentType.id`
- Nombreux composants admin utilisent cette entité
- Filtres establishment par type

## 📊 Success Metrics Phase 2a

### Technical Health
- Build time: No increase
- Bundle size: < 5% increase
- Type coverage: 100% maintained
- API response time: < 500ms

### Business Health
- Admin regions page: Fully functional
- Admin establishment-types page: Fully functional
- No regression on existing admin pages
- Cache performance: Improved load times

## 🎯 Timeline Phase 2a

**Jour 1 (Aujourd'hui)**
- ✅ Plan stratégique créé
- 🔄 Region repository + controller + DI (reste 90 min)

**Jour 2 (Demain)**
- ✅ Region hook + API route + tests
- 🔄 EstablishmentType début migration

**Jour 3 (J+2)**
- ✅ EstablishmentType complet
- ✅ Tests intégration Region + EstablishmentType
- 🔄 Préparation Phase 2b (Mention)

---

**Action immédiate** : Créer `/src/infrastructure/repositories/regions.repository.ts` dans l'heure qui suit.