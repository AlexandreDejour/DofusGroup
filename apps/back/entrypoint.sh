#!/bin/sh
set -e

echo "🏁 Init backend..."
echo "🌍 Environnement : ${NODE_ENV:-development}"

# Attente que PostgreSQL soit prêt
echo "⏳ Waiting for database..."
until npx sequelize-cli db:migrate:status > /dev/null 2>&1; do
  echo "➡️ PostgreSQL not ready yet, new attempt in 3s..."
  sleep 3
done

# --- Différenciation dev / prod ---
if [ "$NODE_ENV" = "production" ]; then
  echo "🏗️ Prod mode : executing migrations and seeds if needed."
  if npx sequelize-cli db:migrate:status | grep -q "down"; then
    echo "🚀 Executing migrations..."
    npx sequelize-cli db:migrate
    if [ ! -f /app/.seeded ]; then
      echo "🌱 Executing initial seeds..."
      npx sequelize-cli db:seed:all
      touch /app/.seeded
    else
      echo "🌱 Seeds already executed."
    fi
  else
    echo "✅ Database already migrated."
  fi
else
  echo "Dev mode : ignore migrations (execute manually npx sequelize-cli db:migrate if needed)."
fi

# --- Executing optionnal command ---
echo "🚀 Launching process : $@"
exec "$@"
