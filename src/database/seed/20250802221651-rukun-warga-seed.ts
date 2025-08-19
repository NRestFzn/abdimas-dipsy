'use strict'

import _ from 'lodash'
import { DataTypes, QueryInterface } from 'sequelize'
import { v4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const formData: any[] = [
    {
      id: v4(),
      name: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await queryInterface.bulkInsert('rukunWarga', formData)
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.bulkDelete('rukunWarga', {})
}
