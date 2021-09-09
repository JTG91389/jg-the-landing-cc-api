"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordRequests1610674297182 = void 0;
const typeorm_1 = require("typeorm");
class ResetPasswordRequests1610674297182 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'ResetPasswordRequests',
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
                    name: 'userId',
                    type: 'uuid',
                },
                {
                    name: 'token',
                    type: 'varchar',
                },
                {
                    name: 'expiresAt',
                    type: 'timestamp with time zone',
                },
                {
                    name: 'expired',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'consumed',
                    type: 'boolean',
                    default: false,
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
        await queryRunner.createForeignKey('ResetPasswordRequests', new typeorm_1.TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Users',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('ResetPasswordRequests');
    }
}
exports.ResetPasswordRequests1610674297182 = ResetPasswordRequests1610674297182;
//# sourceMappingURL=1610674297182-ResetPasswordRequests.js.map