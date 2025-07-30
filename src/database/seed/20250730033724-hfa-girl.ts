'use strict'

import _ from 'lodash'
import { DataTypes, QueryInterface } from 'sequelize'
import { hfaGirl } from '@/lib/constant/hfaGirl'
import { v4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const formData: any[] = []

  if (!_.isEmpty(hfaGirl)) {
    for (let i = 0; i < hfaGirl.length; i += 1) {
      const item = hfaGirl[i]

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
