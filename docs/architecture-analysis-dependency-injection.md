# Analyse Architecturale - Système d'Injection de Dépendances

## Résumé Exécutif

Le système d'injection de dépendances présente une **duplication architecturale critique** avec deux couches parallèles incompatibles :
- Architecture legacy `/src` (référencée par le DI, implémentations incomplètes)
- Architecture moderne `/core` (fonctionnelle, utilisée par l'infrastructure)

**Impact** : Le DI actuel pointe vers du code non-fonctionnel, créant une déconnexion entre la couche d'infrastructure et le système d'injection.

**Recommandation** : Migration complète vers l'architecture `/core` pour unifier le système.

---

## Analyse Détaillée des Inconsistances

### 1. Duplication des Entités

**Localisation actuelle** :
```
/core/entities/city.entity.ts          (moderne, classe avec constructeur)
/src/entities/models/city.entity.ts    (legacy, type Zod)
```

**Différences architecturales** :
- **Core** : `export class City` avec méthode `fromUnknown()`
- **Src** : `export type City = z.infer<typeof CitySchema>`

### 2. Duplication des Interfaces Repository

**Core Interface** (`/core/interfaces/city.repository.interface.ts`) :
```typescript
export interface ICityRepository {
    getAll(token: string, param: PaginationParams): Promise<PaginatedResult<City>>;
    get(token: string, id: number): Promise<City>;
    create(token: string, data: {...}): Promise<City>;
    // ... méthodes claires et directes
}
```

**Src Interface** (`/src/application/repositories/cities.repository.interface.ts`) :
```typescript
export interface ICitiesRepository {
    getCities(token: string, options?: {params: PaginationParams}): Promise<PaginatedResult<City>>;
    getCity(token: string, id: number): Promise<City>;
    createCity(token: string, data: {...}): Promise<City>;
    // ... noms verbeux avec pattern d'options
}
```

### 3. État des Implémentations

**Infrastructure Working** (`/infrastructure/repositories/city.repository.ts`) :
- ✅ Implémente `ICityRepository` (core)
- ✅ Méthodes complètement implémentées
- ✅ Utilisée par l'application

**DI Referenced** (`/src/infrastructure/repositories/cities.repository.ts`) :
- ❌ Implémente `ICitiesRepository` (src)
- ❌ Méthodes lancent "Method not implemented"
- ❌ Non-fonctionnelle

### 4. Analyse d'Utilisation

**Architecture `/core`** :
- 72 fichiers importent depuis `/core/entities`
- Utilisée par toute la couche infrastructure
- Standard de facto de l'application

**Architecture `/src`** :
- 23 fichiers importent depuis `/src/entities`
- Utilisée uniquement par le système DI
- 3 composants utilisent `getInjection`

---

## Configuration DI Actuelle

### Container (`/di/container.ts`)
```typescript
export function getInjection<K extends keyof typeof DI_SYMBOLS>(
    symbol: K
): DI_RETURN_TYPES[K] {
    return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}
```

### Types DI (`/di/types.ts`)
```typescript
export const DI_SYMBOLS = {
    ICitiesRepository: Symbol.for("ICitiesRepository"),    // ❌ Pointe vers /src
    // ...
};

export interface DI_RETURN_TYPES {
    ICitiesRepository: ICitiesRepository;                  // ❌ Interface /src
    // ...
}
```

### Module Cities (`/di/modules/cities.module.ts`)
```typescript
citiesModule.bind(DI_SYMBOLS.ICitiesRepository)
    .toClass(CitiesRepository);                            // ❌ Classe non-fonctionnelle
```

---

## Composants Impactés

### Utilisation Actuelle de `getInjection`
1. `/app/(default)/components/city-selector.tsx`
2. `/app/(default)/components/level-selector.tsx`
3. `/app/(default)/components/domain-selector.tsx`

**Pattern d'utilisation** :
```typescript
const getCitiesController = getInjection("IGetCitiesController");
const result = await getCitiesController(accessToken, {
    params: { perPage: 100, page: 1 }
});
```

---

## Solution Unifiée Proposée

### Phase 1 : Migration du DI vers Architecture Core

#### 1.1 Mise à jour des Types DI
**Fichier** : `/di/types.ts`
```typescript
// Remplacer les imports /src par /core
import { ICityRepository } from "@/core/interfaces/city.repository.interface";

export const DI_SYMBOLS = {
    ICityRepository: Symbol.for("ICityRepository"),        // ✅ Nouveau nom
    // ...
};

export interface DI_RETURN_TYPES {
    ICityRepository: ICityRepository;                      // ✅ Interface core
    // ...
}
```

#### 1.2 Mise à jour des Modules DI
**Fichier** : `/di/modules/cities.module.ts`
```typescript
import { CityApiRepository } from "@/infrastructure/repositories/city.repository";

citiesModule.bind(DI_SYMBOLS.ICityRepository)
    .toClass(CityApiRepository);                           // ✅ Classe fonctionnelle
```

#### 1.3 Création de Contrôleurs Core-Compatible
**Nouveau fichier** : `/core/controllers/city.controller.ts`
```typescript
import { ICityRepository } from "@/core/interfaces/city.repository.interface";

export const createCityController = (repository: ICityRepository) =>
    async (token: string, params: PaginationParams) => {
        return await repository.getAll(token, params);
    };
```

### Phase 2 : Mise à jour des Composants

#### 2.1 Refactoring des Sélecteurs
**Exemple** : `city-selector.tsx`
```typescript
// Avant
const getCitiesController = getInjection("IGetCitiesController");
const result = await getCitiesController(accessToken, {
    params: { perPage: 100, page: 1 }
});

// Après  
const cityRepository = getInjection("ICityRepository");
const result = await cityRepository.getAll(accessToken, { 
    perPage: 100, 
    page: 1 
});
```

### Phase 3 : Nettoyage

#### 3.1 Suppression Architecture Legacy
```bash
# Supprimer répertoires obsolètes
rm -rf /src/application/repositories/
rm -rf /src/infrastructure/repositories/
rm -rf /src/entities/models/
```

#### 3.2 Mise à jour Imports
- Remplacer tous les imports `/src/entities` par `/core/entities`
- Mettre à jour les imports d'interfaces

---

## Plan d'Implémentation

### Étape 1 : Préparation (30 min)
1. Créer les contrôleurs core-compatible
2. Mettre à jour les types DI
3. Mettre à jour les modules DI

### Étape 2 : Migration (45 min)
1. Refactorer les 3 composants utilisant `getInjection`
2. Tester les sélecteurs de ville, niveau et domaine
3. Valider le fonctionnement de l'API

### Étape 3 : Nettoyage (15 min)
1. Supprimer l'architecture `/src` obsolète
2. Mettre à jour les imports dans l'application
3. Tests de régression complets

### Étape 4 : Validation (30 min)
1. Tests d'intégration des composants
2. Vérification du cache TanStack Query
3. Tests end-to-end des sélecteurs

---

## Bénéfices de la Migration

### Technique
- ✅ **Unification architecturale** : Une seule source de vérité
- ✅ **Code fonctionnel** : Élimination des implémentations vides
- ✅ **Interfaces cohérentes** : Noms et paramètres standardisés
- ✅ **Maintenance simplifiée** : Réduction de la duplication

### Performance
- ✅ **Réduction bundle** : Élimination du code mort
- ✅ **Cache efficace** : Utilisation optimisée de TanStack Query
- ✅ **Types optimisés** : Meilleure inférence TypeScript

### Développement
- ✅ **DX améliorée** : Interface plus intuitive
- ✅ **Cohérence** : Pattern uniforme dans l'application
- ✅ **Évolutivité** : Architecture extensible

---

## Risques et Mitigations

### Risques Identifiés
1. **Breaking changes** dans les composants existants
2. **Régression** des fonctionnalités de sélection
3. **Cache invalidation** TanStack Query

### Mitigations
1. **Tests unitaires** avant et après migration
2. **Migration incrémentale** composant par composant
3. **Backup** de la configuration actuelle
4. **Validation end-to-end** complète

---

## Conclusion

La migration vers l'architecture `/core` est **essentielle et peu risquée** :

- **Impact limité** : Seulement 3 composants à modifier
- **Gain immédiat** : Système DI fonctionnel
- **Architecture propre** : Élimination de la duplication
- **Standard établi** : Alignement sur l'architecture existante

**Recommandation** : Procéder à la migration immédiatement pour éliminer cette dette technique critique.