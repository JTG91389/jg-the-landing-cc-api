import 'reflect-metadata';
import 'module-alias/register';
import { config } from 'dotenv';
import winston from 'winston';
import {
  createConnection,
  Connection,
  DatabaseType,
  ConnectionOptions,
  getConnection,
} from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import connectRedis from 'connect-redis';
import passport from 'passport';
import path from 'path';
import { buildSchema } from 'type-graphql';
import { GraphQLDirective } from 'graphql';
import { ApolloError } from 'apollo-server-errors';
import {
  GraphQLRequestContext,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { AuthenticationChecker } from './helpers/AuthenticationChecker';

/**
 * hackign in env variables outside fo docker

 */
 process.env.NODE_ENV='development';
 process.env.HOST='0.0.0.0';
 process.env.SCHEME='http';
 process.env.PORT='3001';
 process.env.CORS_ORIGIN='http://localhost:3030,http://localhost:3001';
 process.env.REDIS_HOST='redis';
 process.env.REDIS_PORT='6379';
 process.env.HASH_ROTATIONS='8';
 process.env.TYPEORM_CONNECTION='postgres';
 process.env.TYPEORM_HOST='database';
 process.env.TYPEORM_USERNAME='manager';
 process.env.TYPEORM_PASSWORD='potato';
 process.env.TYPEORM_DATABASE='boilerplate-dev';
 process.env.TYPEORM_PORT='35432';
 process.env.TYPEORM_SYNCHRONIZE='false';
 process.env.TYPEORM_LOGGING='all';
 process.env.TYPEORM_ENTITIES='src/entity/*.ts,src/modules/**/entity/*.ts';
 process.env.TYPEORM_MIGRATIONS='src/migration/*.ts';
 process.env.TYPEORM_MIGRATIONS_DIR='src/migration';
 process.env.TYPEORM_SEEDING_FACTORIES='src/factories/**/*{.ts,.js}';
 process.env.TYPEORM_SEEDING_SEEDS='src/seeds/**/*{.ts,.js}';
 process.env.SESSION_COOKIE_NAME='auth';
 process.env.SESSION_SECRET='6e04ad8a8ae84734ac25b3c25f2aab2c';
 process.env.SESSION_MAX_AGE='86400000';
 process.env.APP_URL='localhost:3030';
 process.env.APP_API_URL='localhost:3001';
 process.env.APP_REDIRECT_PATH='/';
 process.env.APP_RESET_PASSWORD_PATH='/reset-password/';
 process.env.APP_REDIRECT_HOMEPAGE='http://localhost:3030';
/**
 * Load env variables
 */
config();
/**
 * Logger
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
/**
 * Import entities
 */
import { User } from './entity/User';
import { ResetPasswordRequest } from './entity/ResetPasswordRequest';
import { Todo } from './entity/Todo';
/**
 * Import resolvers
 */
import { UserResolver } from './resolvers/User';
import { ResetPasswordRequestResolver } from './resolvers/ResetPassword';
import { TodoResolver } from './resolvers/Todo';
/**
 * Directives
 */
import { LowerCaseDirective } from './directives';
/**
 * Create database connnection
 */
async function connect(): Promise<Connection> {
  try {
    return await createConnection({
      database: process.env.TYPEORM_DATABASE,
      entities: [User, ResetPasswordRequest, Todo],
      host: 'host.docker.internal',
      password: process.env.TYPEORM_PASSWORD,
      port: Number(process.env.TYPEORM_PORT),
      type: process.env.TYPEORM_CONNECTION as DatabaseType,
      username: process.env.TYPEORM_USERNAME,
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      seeds: process.env.TYPEORM_SEEDING_SEEDS,
      factories: process.env.TYPEORM_SEEDING_FACTORIES,
      logging: process.env.TYPEORM_LOGGING,
      migrations: [
        path.resolve(__dirname, String(process.env.TYPEORM_MIGRATIONS)),
      ],
    } as ConnectionOptions);
  } catch (err) {
    console.log(err);
    return {} as Connection;
  }
}
/**
 * Main - Server entry
 */
async function main(): Promise<void> {
  /**
   * Database Connection
   */
  await connect();
  /**
   * Application
   */
  const app = express();
  // enable this if you run behind a proxy (e.g. nginx)
  app.set('trust proxy', 1);
  /**
   * Redis
   */
  const redisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  });
  redisClient.on('error', (error) => {
    logger.error(error.message);
  });
  redisClient.on('connect', function () {
    console.log(
      `Redis connected at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    );
  });
  /**
   * Apply Middlewares
   */
  app.use(
    cors({
      origin: (origin, callback) => {
        const origins = String(process.env.CORS_ORIGIN).split(',');
        // check if domain is allowed
        if (!origin || origins.includes(String(origin))) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed.'), false);
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.use(
    express.json({
      limit: '20mb',
    }),
  );
  app.use(
    express.urlencoded({
      extended: true,
    }),
  );
  app.use(
    session({
      name: process.env.SESSION_COOKIE_NAME,
      secret: String(process.env.SESSION_SECRET),
      store: new redisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true,
        maxAge: Number(process.env.SESSION_MAX_AGE),
        sameSite: 'lax',
      },
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  /**
   * Generate a schema for Apollo
   */
  const schema = await buildSchema({
    resolvers: [UserResolver, ResetPasswordRequestResolver, TodoResolver],
    validate: process.env.NODE_ENV === 'production' ? true : false,
    authChecker: AuthenticationChecker,
    directives: [
      new GraphQLDirective({
        name: 'lowerCase',
        locations: [
          'INPUT_FIELD_DEFINITION',
          'INPUT_OBJECT',
          'OBJECT',
          'ARGUMENT_DEFINITION',
          'FIELD',
          'FIELD_DEFINITION',
        ],
        description: 'Apply lower-casing to fields',
      }),
    ],
  });
  /**
   * Land Apollo server
   */
  new ApolloServer({
    schema,
    schemaDirectives: {
      lowerCase: LowerCaseDirective,
    },
    context({ req, res }) {
      return {
        req,
        res,
        redisClient,
        passport,
        getConnection,
      };
    },
    uploads: {
      maxFileSize: 4000,
      maxFiles: 10,
    },
    plugins: [
      {
        requestDidStart(): GraphQLRequestListener | void {
          return {
            didEncounterErrors(requestContext: GraphQLRequestContext): void {
              if (!requestContext.operation) {
                return;
              }
              if (requestContext.errors) {
                for (const error of requestContext.errors) {
                  if (error instanceof ApolloError) {
                    return;
                  }
                }
              }
            },
          };
        },
      },
    ],
  }).applyMiddleware({
    app,
    cors: false,
    path: '/api',
  });

  app.listen(3001, () => {
    console.log(
      `🚀 Server ready at ${process.env.SCHEME}://${process.env.HOST}:${3001}`,
    );
  });
}

main().catch((error) => {
  logger.error(error.message);
});
