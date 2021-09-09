"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMigration1609901955279 = void 0;
const typeorm_1 = require("typeorm");
class UserMigration1609901955279 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'Users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    isUnique: true,
                    generationStrategy: 'uuid',
                    default: `uuid_generate_v4()`,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                    isNullable: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'username',
                    type: 'varchar',
                    isNullable: true,
                    isUnique: true,
                },
                {
                    name: 'userType',
                    type: 'enum',
                    enum: ['NORMAL', 'BETA', 'ADMIN'],
                    isNullable: false,
                    default: "'NORMAL'",
                },
                {
                    name: 'emailVerifiedAt',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'refreshToken',
                    type: 'varchar',
                    isNullable: true,
                    isUnique: true,
                },
                {
                    name: 'accessToken',
                    type: 'varchar',
                    isNullable: true,
                    isUnique: true,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp with time zone',
                    default: 'NOW()',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp with time zone',
                    isNullable: true,
                },
                {
                    name: 'deletedAt',
                    type: 'timestamp with time zone',
                    isNullable: true,
                },
            ],
        }));
        await queryRunner.createIndex('Users', new typeorm_1.TableIndex({
            name: 'emailIndex',
            columnNames: ['email'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('Users');
    }
}
exports.UserMigration1609901955279 = UserMigration1609901955279;
//# sourceMappingURL=1609901955279-UserMigration.js.map