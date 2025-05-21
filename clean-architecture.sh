#!/bin/bash

# Création de la nouvelle structure de dossiers pour Clean Architecture
mkdir -p core/domain/{entities,repositories,usecases}
mkdir -p core/application/{services,dto}
mkdir -p infrastructure/{api,repositories,services}
mkdir -p presentation/components/{ui,features}
mkdir -p presentation/{hooks,contexts,layouts}
mkdir -p shared/{utils,types,constants}

# Déplacement des fichiers et dossiers existants

# 1. Déplacer les composants UI
if [ -d "components/ui" ]; then
  cp -r components/ui/* presentation/components/ui/
  echo "Composants UI déplacés vers presentation/components/ui/"
fi

# 2. Déplacer l'API
if [ -d "components/api" ]; then
  cp -r components/api/* infrastructure/api/
  echo "API déplacée vers infrastructure/api/"
fi

# 3. Déplacer les autres composants (features)
mkdir -p presentation/components/features/tmp
for file in components/*.{jsx,tsx,js,ts}; do
  if [ -f "$file" ] && [[ "$file" != *"ui/"* ]] && [[ "$file" != *"api/"* ]]; then
    cp "$file" presentation/components/features/tmp/
    echo "Composant $(basename $file) déplacé vers presentation/components/features/"
  fi
done
mv presentation/components/features/tmp/* presentation/components/features/ 2>/dev/null
rmdir presentation/components/features/tmp 2>/dev/null

# 4. Déplacer les contexts
if [ -d "contexts" ]; then
  cp -r contexts/* presentation/contexts/
  echo "Contexts déplacés vers presentation/contexts/"
fi

# 5. Déplacer les hooks
if [ -d "hooks" ]; then
  cp -r hooks/* presentation/hooks/
  echo "Hooks déplacés vers presentation/hooks/"
fi

# 6. Déplacer les utils
if [ -d "lib" ]; then
  cp -r lib/* shared/utils/
  echo "Utils déplacés vers shared/utils/"
fi

# Création de fichiers d'exemple pour la Clean Architecture
echo "// Interface de base pour les établissements" > core/domain/entities/Establishment.ts
echo "// Interface du repository pour les établissements" > core/domain/repositories/EstablishmentRepository.ts
echo "// Cas d'utilisation pour récupérer les établissements" > core/domain/usecases/GetEstablishmentsUseCase.ts
echo "// Implémentation du repository pour les établissements" > infrastructure/repositories/EstablishmentRepositoryImpl.ts

echo "Structure Clean Architecture créée avec succès!"
echo "ATTENTION: Ce script a copié les fichiers existants vers la nouvelle structure."
echo "Vérifiez que tout fonctionne correctement avant de supprimer les anciens dossiers."