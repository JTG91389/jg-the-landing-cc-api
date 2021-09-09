import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'Todo' })
@ObjectType()
export class Todo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
  })
  task!: string;

  @Field(() => Boolean)
  @Column({
    type: 'boolean',
    default: false,
  })
  complete?: boolean;

  @Column({ type: 'integer', name: 'user_id' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.todos, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Field(() => Date)
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: true,
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  updatedAt!: Date;

  @Field(() => Date, {
    nullable: true,
  })
  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  deletedAt!: Date;
}
