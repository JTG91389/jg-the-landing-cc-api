"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = exports.UserResponse = void 0;
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const apollo_server_1 = require("apollo-server");
const User_1 = require("../entity/User");
const UserInput_1 = require("../inputs/UserInput");
const FormError_1 = require("../types/FormError");
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FormError_1.FormError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserResponse.prototype, "message", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
exports.UserResponse = UserResponse;
let UserResolver = class UserResolver {
    async me({ req }, id) {
        var _a, _b;
        try {
            if (!req.session.userId && !req.user && !id) {
                return {
                    errors: [
                        {
                            field: 'user',
                            message: 'User already logged out.',
                        },
                    ],
                };
            }
            try {
                const user = await User_1.User.findOne({ where: {
                        id: (((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.userId) || ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id)) || id
                    }
                });
                return {
                    user,
                };
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
        catch (error) {
            return {
                errors: [
                    {
                        field: 'exception',
                        message: error.message,
                    },
                ],
            };
        }
    }
    async getUser({ id }) {
        try {
            const user = await User_1.User.findOneOrFail({
                where: { id },
            });
            return { user };
        }
        catch (error) {
            return {
                errors: [
                    {
                        field: 'exception',
                        message: error,
                    },
                ],
            };
        }
    }
    async signup({ email, password, username }, { req }) {
        try {
            password = await argon2_1.default.hash(password);
            const user = await typeorm_1.getManager().transaction(async (transaction) => {
                var _a;
                const existingUser = await transaction.findOne(User_1.User, {
                    where: [
                        {
                            email,
                        },
                        {
                            username,
                        },
                    ],
                });
                if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) === email) {
                    throw new apollo_server_1.UserInputError('A user with same email already exists.', {
                        field: 'email',
                    });
                }
                if (((_a = existingUser === null || existingUser === void 0 ? void 0 : existingUser.username) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === username.toLowerCase()) {
                    throw new apollo_server_1.UserInputError('A user with same username already exists.', {
                        field: 'username',
                    });
                }
                // create a new user instance
                const user = transaction.create(User_1.User, {
                    username,
                    email,
                    password,
                });
                await transaction.save(user, {
                    reload: true,
                });
                // return the created user
                return user;
            });
            req.session.userId = user.id;
            return {
                user,
            };
        }
        catch (error) {
            return {
                errors: [
                    {
                        field: error.field || 'exception',
                        message: error.message,
                    },
                ],
            };
        }
    }
    async signin({ email, password }, { req }) {
        try {
            email = email.toLocaleLowerCase();
            const user = await typeorm_1.getManager().transaction(async (transaction) => {
                const user = await transaction.findOne(User_1.User, {
                    where: {
                        email,
                    },
                });
                // throw an exception if no user found
                if (!user) {
                    throw new apollo_server_1.UserInputError('Wrong email', {
                        field: 'email',
                    });
                }
                // verify the password
                await argon2_1.default.verify(user.password, password).catch(async () => {
                    // hash the password
                    user.password = await argon2_1.default.hash(password);
                    // save
                    transaction.save(user);
                });
                return user;
            });
            req.session.userId = user.id;
            return {
                user,
            };
        }
        catch (error) {
            return {
                errors: [
                    {
                        field: error.field || 'exception',
                        message: error.message,
                    },
                ],
            };
        }
    }
    async logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            if (process.env.SESSION_COOKIE_NAME) {
                res.clearCookie(process.env.SESSION_COOKIE_NAME);
            }
            if (err) {
                resolve({
                    errors: [
                        {
                            field: 'exception',
                            message: err.message,
                        },
                    ],
                });
            }
            resolve({
                message: 'User logged out succcessfully',
            });
        }));
    }
};
__decorate([
    type_graphql_1.Query(() => UserResponse, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg('id', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => UserResponse, { nullable: true }),
    type_graphql_1.Authorized([User_1.UserType.ADMIN_USER]),
    __param(0, type_graphql_1.Arg('params')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput_1.UserGetInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('params')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput_1.UserSignUpInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signup", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('params')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput_1.UserSignInInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signin", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=User.js.map