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
exports.TodoDeleteInput = exports.TodoUpdateInput = exports.TodoCreateInput = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
let TodoCreateInput = class TodoCreateInput {
};
__decorate([
    type_graphql_1.Field(),
    class_validator_1.MaxLength(200),
    class_validator_1.MinLength(1),
    __metadata("design:type", String)
], TodoCreateInput.prototype, "task", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], TodoCreateInput.prototype, "userId", void 0);
TodoCreateInput = __decorate([
    type_graphql_1.InputType()
], TodoCreateInput);
exports.TodoCreateInput = TodoCreateInput;
let TodoUpdateInput = class TodoUpdateInput {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    __metadata("design:type", String)
], TodoUpdateInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Directive('@lowerCase'),
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], TodoUpdateInput.prototype, "task", void 0);
__decorate([
    type_graphql_1.Directive('@lowerCase'),
    type_graphql_1.Field(() => Boolean),
    __metadata("design:type", Boolean)
], TodoUpdateInput.prototype, "complete", void 0);
TodoUpdateInput = __decorate([
    type_graphql_1.InputType()
], TodoUpdateInput);
exports.TodoUpdateInput = TodoUpdateInput;
let TodoDeleteInput = class TodoDeleteInput {
};
__decorate([
    type_graphql_1.Directive('@lowerCase'),
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], TodoDeleteInput.prototype, "id", void 0);
TodoDeleteInput = __decorate([
    type_graphql_1.InputType()
], TodoDeleteInput);
exports.TodoDeleteInput = TodoDeleteInput;
// @InputType()
// export class TodoGetInput {
//   @Field(() => ID)
//   id!: string;
// }
//# sourceMappingURL=TodoInputs.js.map