#!/usr/bin/env bash
set -euo pipefail

# Script d'initialisation pour un VPS Ubuntu/Debian
# Usage : chmod +x scripts/setup_server.sh && sudo ./scripts/setup_server.sh

echo "✔️ Mise à jour des paquets"
sudo apt update && sudo apt upgrade -y

echo "✔️ Installation des dépendances : ca-certificates, curl"
sudo apt install -y ca-certificates curl gnupg lsb-release

echo "✔️ Installation de Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  rm get-docker.sh
fi

echo "✔️ Ajouter l'utilisateur courant au groupe docker (nécessite relogin)"
sudo usermod -aG docker $USER || true

echo "✔️ Installation de Docker Compose (plugin)"
sudo apt install -y docker-compose-plugin || true

# Create deploy directory and copy docker-compose
mkdir -p ~/deploy/ecommerce
cd ~/deploy/ecommerce

# Copy provided docker-compose.yml from repo if present (optionnel)
if [ -f "$HOME/deploy/ecommerce/docker-compose.yml" ]; then
  echo "docker-compose.yml already present"
else
  echo "Veuillez copier le fichier docker-compose.yml ici (scp depuis votre machine locale)"
fi

echo "✔️ Création de .env si absent"
if [ ! -f .env ]; then
  cat > .env <<'EOF'
MYSQL_ROOT_PASSWORD=change_this
MYSQL_DATABASE=ecommerce_db
MYSQL_USER=ecom
MYSQL_PASSWORD=strong_password
JWT_SECRET=replace_with_a_secure_value
EOF
  echo ".env créé. Modifiez les valeurs en conséquence."
fi

echo "✔️ Pull & up des conteneurs (si images disponibles)"
docker compose pull || true
docker compose up -d --remove-orphans

echo "✅ Initialisation complète. Assurez-vous d'avoir ajouté la clé publique SSH au fichier ~/.ssh/authorized_keys de l'utilisateur deploy et d'avoir configuré GitHub Secrets (DEPLOY_HOST, DEPLOY_USER, DEPLOY_KEY)."
