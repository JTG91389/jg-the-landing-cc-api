import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { getManager } from 'typeorm';
import { UserInputError } from 'apollo-server';
import { Todo } from '../entity/Todo';
import { ContextType } from '../types';
import {
  TodoCreateInput,
  TodoUpdateInput,
  TodoGetInput,
  TodoDeleteInput
} from '../inputs/TodoInputs';

import { FormError } from '../types/FormError';

@ObjectType()
export class TodoResponse {
  @Field(() => [FormError], { nullable: true })
  errors?: FormError[];

  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];

  @Field(() => String, { nullable: true })
  message?: string;
}
@Resolver(Todo)
export class TodoResolver {
  @Query(() => TodoResponse, { nullable: true })
  async mine(@Ctx() { req }: ContextType): Promise<TodoResponse> {
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

      const todos = await Todo.find({ where: { userId: req.session.userId || req.user.id } });

      return {
        todos
      };
    } catch (error) {
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

  @Query(() => TodoResponse, { nullable: true })
  async getTodo(
      @Arg('params') 
      { id }: TodoGetInput): Promise<TodoResponse> {
    try {
      const todoModel = await Todo.findOneOrFail({
        where: { id },
      });

      return { todos: [todoModel] };
    } catch (error) {
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

  @Mutation(() => TodoResponse)
  async createTodo(
    @Arg('params')
    { task, userId }: TodoCreateInput,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo = await getManager().transaction(async (transaction) => {
        const todoModel = transaction.create(Todo, {
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
    } catch (error) {
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

  @Mutation(() => TodoResponse)
  async updateTodo(
    @Arg('params')
    { id, task, complete }: TodoUpdateInput,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo = await getManager().transaction(async (transaction) => {
        const todoModel = await transaction.findOne(Todo, {
          where: {
            id,
          },
        });
        // throw an exception if no todo found
        if (!todoModel) {
          throw new UserInputError('no such ID found', {
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
    } catch (error) {
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

  @Mutation(() => TodoResponse)
  async deleteTodo(
    @Arg('params')
    { id }: TodoDeleteInput,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo = await getManager().transaction(async (transaction) => {
        const todoModel = await transaction.findOne(Todo, {
          where: {
            id,
          },
        });
        // throw an exception if no todo found
        if (!todoModel) {
          throw new UserInputError('no such ID found', {
            field: 'id',
          });
        }
        todoModel.remove();
        return todoModel;
      });

      return {
        todos: [todo],
      };
    } catch (error) {
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
}
