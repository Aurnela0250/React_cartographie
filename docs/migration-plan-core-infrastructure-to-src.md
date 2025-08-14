# Plan de Migration Complète : /core + /infrastructure → /src

## 📊 Analyse de Faisabilité

### État Actuel
- **144 imports** depuis `/core`
- **65 imports** depuis `/infrastructure` 
- **31 fichiers** dans `/infrastructure`
- **36 fichiers** dans `/core`
- **Architecture cible** : Clean Architecture dans `/src`

### Effort Estimé
- **Durée totale** : 3-4 semaines (en parallèle du développement)
- **Complexité** : Moyenne-Élevée
- **Risque** : Modéré (architecture bien définie)

### Points Positifs
✅ Architecture `/src` déjà en place et fonctionnelle  
✅ Système DI modulaire avec `@evyweb/ioctopus`  
✅ TanStack Query déjà installé  
✅ Module `cities` déjà migré vers `/src`  

### Défis Identifiés
⚠️ Duplication d'entités (approche classe vs Zod)  
⚠️ 209 imports à réécrire  
⚠️ Coordination avec city data management  
⚠️ Tests et validation continue  

## 🎯 Stratégie de Migration par Phases

### Phase 1 : Unification des Entités (Semaine 1)
**Objectif** : Migrer et standardiser `/core/entities` → `/src/entities/models`

**Tâches** :
1. **Audit des entités dupliquées**
   - Comparer `/core/entities/city.entity.ts` (classe) vs `/src/entities/models/city.entity.ts` (Zod)
   - Décider de l'approche standard : **Zod + TypeScript types**

2. **Migration progressive**
   ```bash
   # Ordre de priorité
   - city.entity.ts ✓ (déjà en cours)
   - users.entity.ts
   - establishment.entity.ts
   - formation.entity.ts
   - [autres entités...]
   ```

3. **Validation**
   - Tests unitaires pour chaque entité migrée
   - Vérification que TanStack Query fonctionne toujours

**Livrable** : Toutes les entités dans `/src/entities/models` avec validation Zod

---

### Phase 2 : Interfaces Repository (Semaine 1-2)
**Objectif** : Migrer `/core/interfaces` → `/src/application/repositories`

**Tâches** :
1. **Audit des interfaces**
   - 11 interfaces repository à migrer
   - Vérifier la compatibilité avec `/src/application/repositories`

2. **Migration des interfaces**
   - Copier les interfaces vers `/src/application/repositories`
   - Adapter les imports dans les implémentations

3. **Mise à jour des modules DI**
   - Vérifier que `cities.module.ts` pointe vers `/src`
   - Créer/ajuster `domains.module.ts` et `levels.module.ts`

**Livrable** : Interfaces unifiées dans `/src/application/repositories`

---

### Phase 3 : Infrastructure (Semaine 2-3)
**Objectif** : Migrer `/infrastructure` → `/src/infrastructure`

**Sous-phase 3a : Repositories**
```typescript
/infrastructure/repositories → /src/infrastructure/repositories
```

**Sous-phase 3b : Services**
```typescript
/infrastructure/services → /src/infrastructure/services
```

**Sous-phase 3c : Actions**
```typescript
/infrastructure/actions → /src/application/actions
/infrastructure/server-actions → /src/application/actions
```

**Tâches critiques** :
- Maintenir la compatibilité API durant la migration
- Mettre à jour progressivement les imports dans `/app`
- Valider que TanStack Query + city selector continuent à fonctionner

**Livrable** : Infrastructure complètement dans `/src`

---

### Phase 4 : Filtres et Utilitaires (Semaine 3)
**Objectif** : Migrer `/core/filters` → `/src/entities/filters`

**Tâches** :
1. Migration des 10 filtres existants
2. Mise à jour des imports dans les composants
3. Validation des filtres API

**Livrable** : Filtres dans `/src/entities/filters`

---

### Phase 5 : Système DI (Semaine 3-4)
**Objectif** : Finaliser la migration du système d'injection de dépendances

**Tâches** :
1. **Audit des modules DI manquants**
   - Créer tous les modules pour les entités migrées
   - Vérifier que tous les symboles DI pointent vers `/src`

2. **Tests d'intégration**
   - Valider que l'injection fonctionne end-to-end
   - Tests des API routes

**Livrable** : DI 100% compatible avec `/src`

---

### Phase 6 : Nettoyage (Semaine 4)
**Objectif** : Suppression sécurisée des anciens dossiers

**Pré-requis** :
- [ ] Tous les tests passent
- [ ] Aucun import vers `/core` ou `/infrastructure`
- [ ] TanStack Query + city management fonctionnent parfaitement
- [ ] Build de production réussit

**Tâches** :
1. Suppression de `/core`
2. Suppression de `/infrastructure` 
3. Nettoyage des imports obsolètes
4. Documentation finale

## 🔄 Impact sur City Data Management

### Stratégie de Continuité
1. **Priorité absolue** : migration de `city.entity.ts` en premier
2. **TanStack Query** : maintenir la compatibilité durant toute la migration
3. **City Selector** : tests continus à chaque phase
4. **API Routes** : migration progressive sans interruption de service

### Plan de Validation Continue
```typescript
// À chaque phase, valider :
- GET /api/cities?perPage=100 fonctionne
- CitySelector charge les données
- TanStack Query met en cache correctement
- Pas de régression UI
```

## 🚨 Gestion des Risques

### Risques Majeurs
| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Breaking changes API | Élevé | Faible | Migration progressive + tests |
| Perte de données cache | Moyen | Moyen | Backup + validation TanStack |
| Conflits de types | Moyen | Élevé | Standardisation Zod précoce |
| Régression UI | Élevé | Faible | Tests automatisés continus |

### Points de Contrôle
- **Après chaque phase** : tous les tests doivent passer
- **Build production** : doit réussir à chaque commit
- **City selector** : doit fonctionner parfaitement
- **Performance** : pas de régression TanStack Query

## 📋 Checklist de Validation

### Phase 1 ✓
- [ ] Entités migrées avec Zod
- [ ] Tests unitaires passent
- [ ] City selector fonctionne
- [ ] TanStack Query compatible

### Phase 2 ✓
- [ ] Interfaces repository migrées
- [ ] Modules DI mis à jour
- [ ] Build réussit

### Phase 3 ✓
- [ ] Repositories migrés
- [ ] Services migrés  
- [ ] Actions migrées
- [ ] API routes fonctionnent

### Phase 4 ✓
- [ ] Filtres migrés
- [ ] Filtres API testés

### Phase 5 ✓
- [ ] DI 100% dans /src
- [ ] Tests d'intégration passent

### Phase 6 ✓
- [ ] /core supprimé
- [ ] /infrastructure supprimé
- [ ] Documentation finalisée
- [ ] Production déployée

## 🚀 Ordre d'Exécution Optimal

### Semaine 1
1. **Lundi-Mardi** : Phase 1 (Entités)
2. **Mercredi-Vendredi** : Phase 2 (Interfaces)

### Semaine 2
1. **Lundi-Mercredi** : Phase 3a (Repositories)
2. **Jeudi-Vendredi** : Phase 3b (Services)

### Semaine 3
1. **Lundi-Mardi** : Phase 3c (Actions)
2. **Mercredi-Jeudi** : Phase 4 (Filtres)
3. **Vendredi** : Phase 5 (DI)

### Semaine 4
1. **Lundi-Mardi** : Tests d'intégration
2. **Mercredi** : Phase 6 (Nettoyage)
3. **Jeudi-Vendredi** : Documentation et déploiement

## 💡 Recommandations Stratégiques

1. **Migration progressive** : ne jamais migrer plus d'une couche à la fois
2. **Tests continus** : valider city data management après chaque commit
3. **Backup de sécurité** : commit avant chaque phase majeure
4. **Communication équipe** : informer des changements d'imports
5. **Documentation** : tenir à jour les chemins d'imports

---

**Status** : Plan prêt pour exécution  
**Prochain step** : Commencer Phase 1 - Migration des entités