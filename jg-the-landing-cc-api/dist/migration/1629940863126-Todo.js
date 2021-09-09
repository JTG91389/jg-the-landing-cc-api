"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo1629940863126 = void 0;
const typeorm_1 = require("typeorm");
class Todo1629940863126 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'Todos',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isUnique: true,
                    generationStrategy: 'uuid',
                    default: `uuid_generate_v4()`
                },
                {
                    name: 'task',
                    type: 'varchar',
                    isUnique: false,
                    isNullable: false
                },
                {
                    name: 'complete',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'userId',
                    type: 'uuid'
                },
                {
                    name: 'createdAt',
                    type: 'timestamp with time zone',
                    default: 'NOW()'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp with time zone',
                    isNullable: true
                },
                {
                    name: 'deletedAt',
                    type: 'timestamp with time zone',
                    isNullable: true
                }
            ]
        }));
        await queryRunner.createForeignKey('Todos', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Users'
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('Todos');
    }
}
exports.Todo1629940863126 = Todo1629940863126;
//# sourceMappingURL=1629940863126-Todo.js.map