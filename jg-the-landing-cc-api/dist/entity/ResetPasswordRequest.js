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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordRequest = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let ResetPasswordRequest = class ResetPasswordRequest extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ResetPasswordRequest.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.tokens, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", User_1.User)
], ResetPasswordRequest.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        type: 'varchar',
    }),
    __metadata("design:type", String)
], ResetPasswordRequest.prototype, "token", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn({
        type: 'timestamp with time zone',
        default: false,
    }),
    __metadata("design:type", Date)
], ResetPasswordRequest.prototype, "expiresAt", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], ResetPasswordRequest.prototype, "expired", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    typeorm_1.Column({
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], ResetPasswordRequest.prototype, "consumed", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], ResetPasswordRequest.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date, {
        nullable: true,
    }),
    typeorm_1.UpdateDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], ResetPasswordRequest.prototype, "updatedAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date, {
        nullable: true,
    }),
    typeorm_1.DeleteDateColumn({
        type: 'timestamp with time zone',
        nullable: true,
        default: null,
    }),
    __metadata("design:type", Date)
], ResetPasswordRequest.prototype, "deletedAt", void 0);
ResetPasswordRequest = __decorate([
    typeorm_1.Entity({ name: 'ResetPasswordRequests' }),
    type_graphql_1.ObjectType()
], ResetPasswordRequest);
exports.ResetPasswordRequest = ResetPasswordRequest;
//# sourceMappingURL=ResetPasswordRequest.js.map