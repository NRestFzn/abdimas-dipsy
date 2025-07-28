'use strict'

import _ from 'lodash'
import { DataTypes, QueryInterface } from 'sequelize'
import { RoleId } from '@/lib/constant/roleIds'

const data = [
  {
    id: RoleId.admin,
    name: 'admin',
  },
  {
    id: RoleId.user,
    name: 'user',
  },
]

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const formData: any[] = []

  if (!_.isEmpty(data)) {
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i]

      formData.push({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  await queryInterface.bulkInsert('role', formData)
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.bulkDelete('role', {})
}
