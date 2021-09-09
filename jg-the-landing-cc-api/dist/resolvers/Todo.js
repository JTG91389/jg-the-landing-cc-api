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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoResolver = exports.TodoResponse = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const apollo_server_1 = require("apollo-server");
const Todo_1 = require("../entity/Todo");
const TodoInputs_1 = require("../inputs/TodoInputs");
const FormError_1 = require("../types/FormError");
let TodoResponse = class TodoResponse {
};
__decorate([
    type_graphql_1.Field(() => [FormError_1.FormError], { nullable: true }),
    __metadata("design:type", Array)
], TodoResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => [Todo_1.Todo], { nullable: true }),
    __metadata("design:type", Array)
], TodoResponse.prototype, "todos", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], TodoResponse.prototype, "message", void 0);
TodoResponse = __decorate([
    type_graphql_1.ObjectType()
], TodoResponse);
exports.TodoResponse = TodoResponse;
let TodoResolver = class TodoResolver {
    async mine({ req }) {
        try {
            if (!req.session.userId && !req.user) {
                return {
                    errors: [
                        {
                            field: 'Todo',
                            message: 'No Todos found for this user',
                        },
                    ],
                };
            }
            const todos = await Todo_1.Todo.find({ where: { userId: req.session.userId || req.user.id } });
            return {
                todos
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
    //   @Query(() => TodoResponse, { nullable: true })
    //   async getTodo(
    //       @Arg('params') 
    //       { id }: TodoGetInput): Promise<TodoResponse> {
    //     try {
    //       const todoModel = await Todo.findOneOrFail({
    //         where: { id },
    //       });
    //       return { todos: [todoModel] };
    //     } catch (error) {
    //       return {
    //         errors: [
    //           {
    //             field: 'exception',
    //             message: error,
    //           },
    //         ],
    //       };
    //     }
    //   }
    async createTodo({ task, userId }, { req }) {
        try {
            const todo = await typeorm_1.getManager().transaction(async (transaction) => {
                const todoModel = transaction.create(Todo_1.Todo, {
                    task,
                    userId
                });
                await transaction.save(todoModel, {
                    reload: true,
                });
                return todoModel;
            });
            return {
                todos: [todo]
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
    async updateTodo({ id, task, complete }, { req }) {
        try {
            const todo = await typeorm_1.getManager().transaction(async (transaction) => {
                const todoModel = await transaction.findOne(Todo_1.Todo, {
                    where: {
                        id,
                    },
                });
                // throw an exception if no todo found
                if (!todoModel) {
                    throw new apollo_server_1.UserInputError('no such ID found', {
                        field: 'id',
                    });
                }
                if (task) {
                    todoModel.task = task;
                }
                if (complete) {
                    todoModel.complete = complete;
                }
                todoModel.save();
                return todoModel;
            });
            return {
                todos: [todo],
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
    async deleteTodo({ id }, { req }) {
        try {
            const todo = await typeorm_1.getManager().transaction(async (transaction) => {
                const todoModel = await transaction.findOne(Todo_1.Todo, {
                    where: {
                        id,
                    },
                });
                // throw an exception if no todo found
                if (!todoModel) {
                    throw new apollo_server_1.UserInputError('no such ID found', {
                        field: 'id',
                    });
                }
                todoModel.remove();
                return todoModel;
            });
            return {
                todos: [todo],
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
};
__decorate([
    type_graphql_1.Query(() => TodoResponse, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "mine", null);
__decorate([
    type_graphql_1.Mutation(() => TodoResponse),
    __param(0, type_graphql_1.Arg('params')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TodoInputs_1.TodoCreateInput, Object]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "createTodo", null);
__decorate([
    type_graphql_1.Mutation(() => TodoResponse),
    __param(0, type_graphql_1.Arg('params')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TodoInputs_1.TodoUpdateInput, Object]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "updateTodo", null);
__decorate([
    type_graphql_1.Mutation(() => TodoResponse),
    __param(0, type_graphql_1.Arg('params')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TodoInputs_1.TodoDeleteInput, Object]),
    __metadata("design:returntype", Promise)
], TodoResolver.prototype, "deleteTodo", null);
TodoResolver = __decorate([
    type_graphql_1.Resolver(Todo_1.Todo)
], TodoResolver);
exports.TodoResolver = TodoResolver;
//# sourceMappingURL=Todo.js.map