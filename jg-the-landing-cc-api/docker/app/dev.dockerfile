FROM node:15-alpine

# Server
ENV NODE_ENV=development \
    HOST=0.0.0.0 \
    SCHEME=http \
    PORT=3001 \
    CORS_ORIGIN=http://localhost:3030,http://localhost:3001 \
    REDIS_HOST=redis \
    REDIS_PORT=6379 \
    HASH_ROTATIONS=8 \
    TYPEORM_CONNECTION=postgres \
    TYPEORM_HOST=database \
    TYPEORM_USERNAME=manager \
    TYPEORM_PASSWORD=potato \
    TYPEORM_DATABASE=boilerplate-dev \
    TYPEORM_PORT=5432 \
    TYPEORM_SYNCHRONIZE=false \
    TYPEORM_LOGGING=all \
    TYPEORM_ENTITIES="src/entity/*.ts,src/modules/**/entity/*.ts" \
    TYPEORM_MIGRATIONS="src/migration/*.ts" \
    TYPEORM_MIGRATIONS_DIR="src/migration" \
    TYPEORM_SEEDING_FACTORIES="src/factories/**/*{.ts,.js}" \
    TYPEORM_SEEDING_SEEDS="src/seeds/**/*{.ts,.js}" \
    SESSION_COOKIE_NAME=auth \
    SESSION_SECRET="6e04ad8a8ae84734ac25b3c25f2aab2c" \
    SESSION_MAX_AGE="86400000" \
    APP_URL="localhost:3030" \
    APP_API_URL="localhost:3001" \
    APP_REDIRECT_PATH="/" \
    APP_RESET_PASSWORD_PATH="/reset-password/" \
    APP_REDIRECT_HOMEPAGE="http://localhost:3030"

WORKDIR /app
COPY ["src/", "/app/src"]
COPY ["ormconfig.json", "/app/"]
COPY ["docker/", "/app/docker"]
COPY ["package.json", "/app/"]
COPY ["tsconfig.json", "/app/"]
COPY [".prettierrc.json", "/app/"]
COPY ["yarn.lock", "/app/"]
COPY [".eslintrc.json", "/app/"]
COPY [".env.example", "/app/"]
ENV NODE_ENV=development
RUN yarn
RUN yarn build
CMD [ "yarn", "start:local:dev" ]