const fs = require('fs')
const path = require('path')
const { v4 } = require('uuid')
const GenderId = require('../../constants/ConstGenderId')

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'whoStandardChildGrows'

    const jsonFilePath = path.resolve(__dirname, '../../data/wfa_girls.json')

    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))

    const records = data.map((record) => ({
      id: v4(),
      gender: 'f',
      ...record,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await queryInterface.bulkInsert(tableName, records, {})
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'whoStandardChildGrows'
    await queryInterface.bulkDelete(tableName, null, {})
  },
}
