'use strict'

import _ from 'lodash'
import { DataTypes, QueryInterface } from 'sequelize'
import { wfaBoy } from '@/lib/constant/wfaBoy'
import { v4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const formData: any[] = []

  if (!_.isEmpty(wfaBoy)) {
    for (let i = 0; i < wfaBoy.length; i += 1) {
      const item = wfaBoy[i]

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
