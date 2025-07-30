'use strict'

import _ from 'lodash'
import { DataTypes, QueryInterface } from 'sequelize'
import { wfaGirl } from '@/lib/constant/wfaGirl'
import { v4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const formData: any[] = []

  if (!_.isEmpty(wfaGirl)) {
    for (let i = 0; i < wfaGirl.length; i += 1) {
      const item = wfaGirl[i]

      formData.push({
        id: v4(),
        ...item,
        gender: 'f',
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
