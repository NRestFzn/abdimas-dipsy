'use strict'

import _ from 'lodash'
import { DataTypes, QueryInterface, QueryTypes } from 'sequelize'
import { v4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const formData: any[] = []

  const rukunWarga: { id: string }[] = await queryInterface.sequelize.query(
    'SELECT id FROM `rukun_wargas` LIMIT 1',
    { type: QueryTypes.SELECT }
  )

  for (let i = 1; i <= 3; i++) {
    formData.push({
      id: v4(),
      name: i,
      RukunWargaId: rukunWarga[0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  await queryInterface.bulkInsert('rukun_tetanggas', formData)
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.bulkDelete('rukun_tetanggas', {})
}
