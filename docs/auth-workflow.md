# Workflow d'implementation de l'authentification

Ce workflow presente une authentification de mon application nextjs avec un bakend rest api.

1. Email et mot de passe envoye dans le backend
2. le backend renvoie un token-data ensuite on stock le token dans les cookies
3. Si le Access Token est expire alors on verifie refresh le token.
4. Si le refresh Token est expire alors on redirige l'utilisateur vers le login.

# Instructions

- Reformater le
