#!/usr/bin/env bash

set -Eeuo pipefail

# Run this script from the cloned project on the shared hosting server.
# Optional overrides:
#   BRANCH=main PUBLIC_DIR=/home/USER/public_html bash deploy.sh

APP_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BRANCH="${BRANCH:-main}"
PUBLIC_DIR="${PUBLIC_DIR:-${HOME}/public_html}"

cd "$APP_ROOT"

FRONTEND_ENV_BACKUP=""
if [[ -f "$APP_ROOT/frontend/.env" ]]; then
  # Keep the server-only API URL out of git pull conflicts.
  FRONTEND_ENV_BACKUP="$(mktemp)"
  mv "$APP_ROOT/frontend/.env" "$FRONTEND_ENV_BACKUP"
fi

restore_frontend_env() {
  if [[ -n "$FRONTEND_ENV_BACKUP" && -f "$FRONTEND_ENV_BACKUP" ]]; then
    mv "$FRONTEND_ENV_BACKUP" "$APP_ROOT/frontend/.env"
    FRONTEND_ENV_BACKUP=""
  fi
}
trap restore_frontend_env EXIT

echo "==> Updating source code"
git pull --ff-only origin "$BRANCH"
restore_frontend_env

echo "==> Installing Laravel dependencies"
composer install \
  --working-dir="$APP_ROOT/services" \
  --no-dev \
  --optimize-autoloader

echo "==> Applying database migrations"
php "$APP_ROOT/services/artisan" migrate --force

echo "==> Refreshing Laravel caches"
php "$APP_ROOT/services/artisan" storage:link || true
php "$APP_ROOT/services/artisan" config:clear
php "$APP_ROOT/services/artisan" route:clear
php "$APP_ROOT/services/artisan" view:clear
php "$APP_ROOT/services/artisan" config:cache
php "$APP_ROOT/services/artisan" route:cache

echo "==> Building frontend"
npm ci --prefix "$APP_ROOT/frontend"
npm run build --prefix "$APP_ROOT/frontend"

echo "==> Publishing frontend to $PUBLIC_DIR"
mkdir -p "$PUBLIC_DIR"
cp -a "$APP_ROOT/frontend/dist/." "$PUBLIC_DIR/"

echo "==> Deployment completed"
