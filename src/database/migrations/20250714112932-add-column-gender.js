module.exports = {
  up: async function (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.addColumn('users', 'gender', {
        type: Sequelize.ENUM(['m', 'f']),
        allowNull: false,
      }),

      queryInterface.addColumn('whoStandardChildGrows', 'gender', {
        type: Sequelize.ENUM(['m', 'f']),
        allowNull: false,
      }),
    ])
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'gender')
    return queryInterface.removeColumn('whoStandardChildGrows', 'gender')
  },
}
