import { Directive, Field, ID, InputType } from 'type-graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class TodoCreateInput {
  @Field()
  @MaxLength(200)
  @MinLength(1)
  task!: string;

  @Field()
  userId!: string;
}

@InputType()
export class TodoUpdateInput {
  @Field(() => ID)
  id!: string;

  @Directive('@lowerCase')
  @Field(() => String)
  task?: string;

  @Directive('@lowerCase')
  @Field(() => Boolean)
  complete?: boolean;
}

@InputType()
export class TodoDeleteInput {
  @Directive('@lowerCase')
  @Field(() => String)
  id!: string;
}

@InputType()
export class TodoGetInput {
  @Field(() => ID)
  id!: string;
}
