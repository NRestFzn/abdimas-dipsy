module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.removeColumn('users', 'MasterGenderId'),
      await queryInterface.removeColumn(
        'whoStandardChildGrows',
        'MasterGenderId'
      ),
      await queryInterface.dropTable('masterGenders'),
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'MasterGenderId', {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'masterGenders',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),

      queryInterface.addColumn('whoStandardChildGrows', 'MasterGenderId', {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'masterGenders',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),

      await queryInterface.createTable('masterGenders', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      }),
    ])
  },
}
