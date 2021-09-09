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
exports.User = exports.UserType = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const ResetPasswordRequest_1 = require("./ResetPasswordRequest");
const Todo_1 = require("./Todo");
var UserType;
(function (UserType) {
    UserType["ADMIN_USER"] = "ADMIN";
    UserType["BETA_USER"] = "BETA";
    UserType["NORMAL_USER"] = "NORMAL";
})(UserType = exports.UserType || (exports.UserType = {}));
type_graphql_1.registerEnumType(UserType, {
    name: 'UserType',
});
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({
        type: 'varchar',
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    type_graphql_1.Field(() => String, {
        nullable: true,
    }),
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => UserType),
    typeorm_1.Column({
        type: 'enum',
        enum: UserType,
        default: UserType.NORMAL_USER,
    }),
    __metadata("design:type", String)
], User.prototype, "userType", void 0);
__decorate([
    type_graphql_1.Field(() => Date, {
        nullable: true,
    }),
    typeorm_1.Column({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    type_graphql_1.Field(() => String, {
        nullable: true,
    }),
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    type_graphql_1.Field(() => String, {
        nullable: true,
    }),
    typeorm_1.Column({
        type: 'varchar',
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "accessToken", void 0);
__decorate([
    typeorm_1.OneToMany(() => Todo_1.Todo, (todo) => todo.user),
    type_graphql_1.Field(() => [Todo_1.Todo], {
        nullable: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "todos", void 0);
__decorate([
    typeorm_1.OneToMany(() => ResetPasswordRequest_1.ResetPasswordRequest, (token) => token.user, {
        cascade: true,
    }),
    type_graphql_1.Field(() => [ResetPasswordRequest_1.ResetPasswordRequest], {
        nullable: true,
    }),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    typeorm_1.CreateDateColumn({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
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
], User.prototype, "updatedAt", void 0);
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
], User.prototype, "deletedAt", void 0);
User = __decorate([
    typeorm_1.Entity({ name: 'Users' }),
    type_graphql_1.ObjectType(),
    typeorm_1.Index(['email'], { unique: true }),
    typeorm_1.Index(['username'], { unique: true })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map