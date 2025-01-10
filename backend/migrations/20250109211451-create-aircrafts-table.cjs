'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('aircrafts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING
            },
            start_date: {
                type: Sequelize.DATE
            },
            finish_date: {
                type: Sequelize.DATE
            }
        });
      // await queryInterface.addConstraint('aircrafts', {
      //     fields: ['user_id'],
      //     type: 'foreign key',
      //     name: 'aircrafts_user_id_fkey',
      //      references: {
      //         table: 'users',
      //         field: 'id'
      //     },
      //       onDelete: 'CASCADE',
      //         onUpdate: 'CASCADE'
      // })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('aircrafts');
        await queryInterface.removeConstraint('aircrafts', 'aircrafts_user_id_fkey')
    }
};
