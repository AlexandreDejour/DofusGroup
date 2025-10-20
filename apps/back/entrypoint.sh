#!/bin/sh
set -e

echo "🏁 Init backend..."
echo "🌍 Environnement : ${NODE_ENV:-development}"

# --- Wair for PostgreSQL ---
echo "⏳ Waiting for PostgreSQL..."
until pg_isready -h db -U $POSTGRES_USER; do
  echo "➡️ PostgreSQL not ready yet..."
  sleep 2
done

# --- Migrations ---
echo "🚀 Executing migrations..."
npx sequelize-cli db:migrate

# --- Seeds (executed if .seeded not exist) ---
echo "🌱 Executing initial seeds..."
npx sequelize-cli db:seed:all

if [ "$NODE_ENV" = "production" ]; then
  echo "🚀 Creating app user role if not exists..."
  psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@db:5432/$POSTGRES_DB" <<EOF
DO
\$do\$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${APP_DB_USER}') THEN
      EXECUTE format('CREATE ROLE %I WITH LOGIN PASSWORD %L', '${APP_DB_USER}', '${APP_DB_PASSWORD}');
   END IF;
END
\$do\$;
EOF

  echo "🚀 Applying permissions for ${APP_DB_USER}..."
  psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@db:5432/$POSTGRES_DB" <<EOF
-- Tables CRUD
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users, events, characters, comments, event_team TO ${APP_DB_USER};

-- Tables lecture seule
GRANT SELECT ON TABLE tags, breeds, servers TO ${APP_DB_USER};
EOF

  echo "✅ Production setup complete. Switching to app user..."
  # Update PG_URL
  export PG_URL="postgresql://${APP_DB_USER}:${APP_DB_PASSWORD}@db:5432/${POSTGRES_DB}"
fi

# --- Executing optional command (e.g., npm start) ---
echo "Link : http://localhost:8080"
echo "🌍 Environnement : $NODE_ENV"
echo "🚀 Launching process : $@"
echo "🔎 PG_URL: $PG_URL"

exec "$@"
