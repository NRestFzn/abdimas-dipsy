module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('whoStandardChildGrows', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      MasterGenderId: {
        type: Sequelize.UUID,
        references: {
          model: 'MasterGenders',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      month: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      L: {
        allowNull: false,
        type: Sequelize.DECIMAL(14, 10),
      },
      M: {
        allowNull: false,
        type: Sequelize.DECIMAL(14, 10),
      },
      S: {
        allowNull: false,
        type: Sequelize.DECIMAL(14, 10),
      },
      type: {
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
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('whoStandardChildGrows')
  },
}
