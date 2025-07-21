module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'MasterGenderId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'masterGenders',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'MasterGenderId')
  },
}
