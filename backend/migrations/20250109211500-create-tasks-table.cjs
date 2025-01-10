'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tasks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            aircraft_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'aircrafts',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING
            },
            manpower: {
                type: Sequelize.INTEGER
            },
            completed: {
                type: Sequelize.BOOLEAN
            }
        });
      // await queryInterface.addConstraint('tasks', {
      //     fields: ['aircraft_id'],
      //     type: 'foreign key',
      //     name: 'tasks_aircraft_id_fkey',
      //      references: {
      //         table: 'aircrafts',
      //         field: 'id'
      //     },
      //      onDelete: 'CASCADE',
      //         onUpdate: 'CASCADE'
      // });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('tasks', 'tasks_aircraft_id_fkey')
        await queryInterface.dropTable('tasks');
    }
};
