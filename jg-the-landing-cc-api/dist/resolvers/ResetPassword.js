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
exports.ResetPasswordRequestResolver = exports.ResetPasswordResponse = void 0;
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = __importDefault(require("crypto"));
const dayjs_1 = __importDefault(require("dayjs"));
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const RequestTokenLinkInput_1 = require("../inputs/RequestTokenLinkInput");
const User_1 = require("../entity/User");
const Emailing_1 = require("../services/Emailing");
const ResetPasswordRequest_1 = require("../entity/ResetPasswordRequest");
const ResetPasswordInput_1 = require("../inputs/ResetPasswordInput");
const FormError_1 = require("../types/FormError");
let ResetPasswordResponse = class ResetPasswordResponse {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ResetPasswordResponse.prototype, "token", void 0);
__decorate([
    type_graphql_1.Field(() => [FormError_1.FormError], { nullable: true }),
    __metadata("design:type", Array)
], ResetPasswordResponse.prototype, "errors", void 0);
ResetPasswordResponse = __decorate([
    type_graphql_1.ObjectType()
], ResetPasswordResponse);
exports.ResetPasswordResponse = ResetPasswordResponse;
let ResetPasswordRequestResolver = class ResetPasswordRequestResolver {
    async requestResetToken(params) {
        try {
            // find a user with that email
            const user = await User_1.User.findOne({
                where: {
                    email: params.email,
                },
                relations: ['profile'],
            });
            // if no user then throw error
            if (!user) {
                throw new Error('The email was not found.');
            }
            // else, generate a token link
            const ResetPasswordRequestModel = new ResetPasswordRequest_1.ResetPasswordRequest();
            // generate a token time based
            const token = crypto_1.default
                .createHmac('sha256', 'secret')
                .update(String(Date.now()))
                .digest('hex');
            // create the model properties
            ResetPasswordRequestModel.token = token;
            ResetPasswordRequestModel.expiresAt = dayjs_1.default().add(1, 'day').toDate();
            ResetPasswordRequestModel.user = user;
            ResetPasswordRequestModel.expired = false;
            ResetPasswordRequestModel.consumed = false;
            // save the model entity
            ResetPasswordRequestModel.save();
            // init the mailer
            const mailer = new Emailing_1.Emailing(user.email, String(process.env.SENDGRID_SENDER_EMAIL));
            // send the reset email
            mailer.resetPasswordRequest(String(user === null || user === void 0 ? void 0 : user.username), `${process.env.SCHEME}://${process.env.APP_URL}${process.env.APP_RESET_PASSWORD_PATH}/${token}`);
            return {
                token: 'done',
            };
        }
        catch (error) {
            return {
                errors: [
                    {
                        field: 'email',
                        message: error.message,
                    },
                ],
            };
        }
    }
    async resetPassword({ token, password }) {
        var _a;
        try {
            // find the token and extract the user
            const tokenModel = await typeorm_1.getRepository(ResetPasswordRequest_1.ResetPasswordRequest).findOne({
                where: {
                    token,
                    consumed: false,
                    expired: false,
                },
                relations: ['user'],
            });
            // check if not empty || user not found
            if (!tokenModel || !((_a = tokenModel === null || tokenModel === void 0 ? void 0 : tokenModel.user) === null || _a === void 0 ? void 0 : _a.id)) {
                throw Error('Invalid token.');
            }
            // check that the password is not empty
            if (!password.length) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: 'Password is invalid.',
                        },
                    ],
                };
            }
            // set token consumed to true
            tokenModel.consumed = true;
            // reset the password
            tokenModel.user.password = await argon2_1.default.hash(password);
            // save the token model
            tokenModel.save();
            tokenModel.user.save();
            // return the token
            return {
                token,
            };
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
};
__decorate([
    type_graphql_1.Mutation(() => ResetPasswordResponse),
    type_graphql_1.Authorized([User_1.UserType.NORMAL_USER, User_1.UserType.ADMIN_USER]),
    __param(0, type_graphql_1.Arg('params')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestTokenLinkInput_1.RequestTokenLinkInput]),
    __metadata("design:returntype", Promise)
], ResetPasswordRequestResolver.prototype, "requestResetToken", null);
__decorate([
    type_graphql_1.Mutation(() => ResetPasswordResponse),
    type_graphql_1.Authorized([User_1.UserType.NORMAL_USER, User_1.UserType.ADMIN_USER]),
    __param(0, type_graphql_1.Arg('params')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordInput_1.ResetPasswordInput]),
    __metadata("design:returntype", Promise)
], ResetPasswordRequestResolver.prototype, "resetPassword", null);
ResetPasswordRequestResolver = __decorate([
    type_graphql_1.Resolver(ResetPasswordRequest_1.ResetPasswordRequest)
], ResetPasswordRequestResolver);
exports.ResetPasswordRequestResolver = ResetPasswordRequestResolver;
//# sourceMappingURL=ResetPassword.js.map