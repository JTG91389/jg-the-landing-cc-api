import {MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
    TableForeignKey} from "typeorm";

export class Todo1629940863126 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
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
            })
        );

        await queryRunner.createForeignKey(
            'Todos',
            new TableForeignKey({
              columnNames: ['userId'],
              referencedColumnNames: ['id'],
              referencedTableName: 'Users'
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Todos');
    }
}
