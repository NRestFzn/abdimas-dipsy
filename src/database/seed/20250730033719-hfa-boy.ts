'use strict'

import _ from 'lodash'
import { DataTypes, QueryInterface } from 'sequelize'
import { hfaBoy } from '@/lib/constant/hfaBoy'
import { v4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const formData: any[] = []

  if (!_.isEmpty(hfaBoy)) {
    for (let i = 0; i < hfaBoy.length; i += 1) {
      const item = hfaBoy[i]

      formData.push({
        id: v4(),
        ...item,
        gender: 'm',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  await queryInterface.bulkInsert('whoStandardChildGrow', formData)
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.bulkDelete('whoStandardChildGrow', {})
}
