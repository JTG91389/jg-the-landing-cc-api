"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("module-alias/register");
const dotenv_1 = require("dotenv");
const winston_1 = __importDefault(require("winston"));
const typeorm_1 = require("typeorm");
const apollo_server_express_1 = require("apollo-server-express");
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const redis_1 = __importDefault(require("redis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const graphql_1 = require("graphql");
const apollo_server_errors_1 = require("apollo-server-errors");
const AuthenticationChecker_1 = require("./helpers/AuthenticationChecker");
/**
 * hackign in env variables outside fo docker

 */
process.env.NODE_ENV = 'development';
process.env.HOST = '0.0.0.0';
process.env.SCHEME = 'http';
process.env.PORT = '3001';
process.env.CORS_ORIGIN = 'http://localhost:3030,http://localhost:3001';
process.env.REDIS_HOST = 'redis';
process.env.REDIS_PORT = '6379';
process.env.HASH_ROTATIONS = '8';
process.env.TYPEORM_CONNECTION = 'postgres';
process.env.TYPEORM_HOST = 'database';
process.env.TYPEORM_USERNAME = 'manager';
process.env.TYPEORM_PASSWORD = 'potato';
process.env.TYPEORM_DATABASE = 'boilerplate-dev';
process.env.TYPEORM_PORT = '35432';
process.env.TYPEORM_SYNCHRONIZE = 'false';
process.env.TYPEORM_LOGGING = 'all';
process.env.TYPEORM_ENTITIES = 'src/entity/*.ts,src/modules/**/entity/*.ts';
process.env.TYPEORM_MIGRATIONS = 'src/migration/*.ts';
process.env.TYPEORM_MIGRATIONS_DIR = 'src/migration';
process.env.TYPEORM_SEEDING_FACTORIES = 'src/factories/**/*{.ts,.js}';
process.env.TYPEORM_SEEDING_SEEDS = 'src/seeds/**/*{.ts,.js}';
process.env.SESSION_COOKIE_NAME = 'auth';
process.env.SESSION_SECRET = '6e04ad8a8ae84734ac25b3c25f2aab2c';
process.env.SESSION_MAX_AGE = '86400000';
process.env.APP_URL = 'localhost:3030';
process.env.APP_API_URL = 'localhost:3001';
process.env.APP_REDIRECT_PATH = '/';
process.env.APP_RESET_PASSWORD_PATH = '/reset-password/';
process.env.APP_REDIRECT_HOMEPAGE = 'http://localhost:3030';
/**
 * Load env variables
 */
dotenv_1.config();
/**
 * Logger
 */
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'combined.log' }),
    ],
});
/**
 * Import entities
 */
const User_1 = require("./entity/User");
const ResetPasswordRequest_1 = require("./entity/ResetPasswordRequest");
const Todo_1 = require("./entity/Todo");
/**
 * Import resolvers
 */
const User_2 = require("./resolvers/User");
const ResetPassword_1 = require("./resolvers/ResetPassword");
const Todo_2 = require("./resolvers/Todo");
/**
 * Directives
 */
const directives_1 = require("./directives");
/**
 * Create database connnection
 */
async function connect() {
    try {
        return await typeorm_1.createConnection({
            database: process.env.TYPEORM_DATABASE,
            entities: [User_1.User, ResetPasswordRequest_1.ResetPasswordRequest, Todo_1.Todo],
            host: 'host.docker.internal',
            password: process.env.TYPEORM_PASSWORD,
            port: Number(process.env.TYPEORM_PORT),
            type: process.env.TYPEORM_CONNECTION,
            username: process.env.TYPEORM_USERNAME,
            synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
            seeds: process.env.TYPEORM_SEEDING_SEEDS,
            factories: process.env.TYPEORM_SEEDING_FACTORIES,
            logging: process.env.TYPEORM_LOGGING,
            migrations: [
                path_1.default.resolve(__dirname, String(process.env.TYPEORM_MIGRATIONS)),
            ],
        });
    }
    catch (err) {
        console.log(err);
        return {};
    }
}
/**
 * Main - Server entry
 */
async function main() {
    /**
     * Database Connection
     */
    await connect();
    /**
     * Application
     */
    const app = express_1.default();
    // enable this if you run behind a proxy (e.g. nginx)
    app.set('trust proxy', 1);
    /**
     * Redis
     */
    const redisStore = connect_redis_1.default(express_session_1.default);
    const redisClient = redis_1.default.createClient({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    });
    redisClient.on('error', (error) => {
        logger.error(error.message);
    });
    redisClient.on('connect', function () {
        console.log(`Redis connected at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    });
    /**
     * Apply Middlewares
     */
    app.use(cors_1.default({
        origin: (origin, callback) => {
            const origins = String(process.env.CORS_ORIGIN).split(',');
            // check if domain is allowed
            if (!origin || origins.includes(String(origin))) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed.'), false);
            }
        },
        credentials: true,
        optionsSuccessStatus: 200,
    }));
    app.use(helmet_1.default({
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }));
    app.use(express_1.default.json({
        limit: '20mb',
    }));
    app.use(express_1.default.urlencoded({
        extended: true,
    }));
    app.use(express_session_1.default({
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
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    /**
     * Generate a schema for Apollo
     */
    const schema = await type_graphql_1.buildSchema({
        resolvers: [User_2.UserResolver, ResetPassword_1.ResetPasswordRequestResolver, Todo_2.TodoResolver],
        validate: process.env.NODE_ENV === 'production' ? true : false,
        authChecker: AuthenticationChecker_1.AuthenticationChecker,
        directives: [
            new graphql_1.GraphQLDirective({
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
    new apollo_server_express_1.ApolloServer({
        schema,
        schemaDirectives: {
            lowerCase: directives_1.LowerCaseDirective,
        },
        context({ req, res }) {
            return {
                req,
                res,
                redisClient,
                passport: passport_1.default,
                getConnection: typeorm_1.getConnection,
            };
        },
        uploads: {
            maxFileSize: 4000,
            maxFiles: 10,
        },
        plugins: [
            {
                requestDidStart() {
                    return {
                        didEncounterErrors(requestContext) {
                            if (!requestContext.operation) {
                                return;
                            }
                            if (requestContext.errors) {
                                for (const error of requestContext.errors) {
                                    if (error instanceof apollo_server_errors_1.ApolloError) {
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
        console.log(`🚀 Server ready at ${process.env.SCHEME}://${process.env.HOST}:${3001}`);
    });
}
main().catch((error) => {
    logger.error(error.message);
});
//# sourceMappingURL=server.js.map