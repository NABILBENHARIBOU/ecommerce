Déploiement — Docker Compose + GHCR + Déploiement SSH

Résumé rapide:
- Build images frontend/backend, push sur GHCR
- Sur le serveur (VPS), pull images et démarrer via `docker-compose up -d`

Pré-requis pour le serveur:
- Docker & Docker Compose installés
- Compte GitHub avec repository et accès GHCR
- Dossier de déploiement (ex: `~/deploy/ecommerce`)

Étapes locales / manuelles:
1. Copier `.env.example` -> `.env` et ajuster les valeurs
2. Build local & lancer: `docker-compose up -d --build`
3. Vérifier que `backend` sur port 8080 et `frontend` sur 80 répondent

CI/CD (GitHub Actions):
- Le workflow `.github/workflows/ci-cd.yml` construit et pousse les images sur GHCR.
- Pour déployer automatiquement via SSH, ajoutez ces secrets au repo: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_KEY` (clé privée), et optionnellement `DOCKER_COMPOSE`.

Notes sécurités & recommandations:
- Utiliser une DB managée pour production (RDS, PlanetScale, etc.) et garder les credentials dans GitHub Secrets
- Configurer TLS (Let’s Encrypt) sur un reverse proxy (nginx) ou via un service (Cloudflare)
- Sauvegardes régulières de la DB et des uploads

Clés SSH & GitHub Secrets
1. J'ai généré une paire SSH pour le déploiement dans le dossier local `.deploy/` :
   - Clé publique: `.deploy/deploy_key.pub`
   - Clé privée: `.deploy/deploy_key` (NE PAS COMMITTER)

2. Ajoutez la clé publique au serveur (ex: utilisateur `deploy`):
   - Sur votre machine locale :
     ssh-copy-id -i .deploy/deploy_key.pub deploy@votre_serveur
   - Ou manuellement : copier le contenu de `.deploy/deploy_key.pub` et l'ajouter à `~/.ssh/authorized_keys` de l'utilisateur de déploiement

3. Ajoutez les secrets GitHub (Settings → Secrets → Actions) :
   - `DEPLOY_HOST` = `votre_serveur` (IP ou domaine)
   - `DEPLOY_USER` = `deploy` (ou l'utilisateur SSH)
   - `DEPLOY_KEY` = contenu de `.deploy/deploy_key` (entière clé privée)

4. Optionnel : `DOCKER_COMPOSE` si vous préférez stocker le `docker-compose.yml` dans les secrets (ou garder le fichier sur le serveur)

Besoin que je copie la clé publique quelque part ou que je vous aide à configurer les secrets GitHub ? Dites "Oui, configure" et je vous guide pas à pas.