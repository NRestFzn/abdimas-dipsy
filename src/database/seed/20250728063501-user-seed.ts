'use strict'

import { green } from 'colorette'
import _ from 'lodash'
import { DataTypes, QueryInterface } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import { env } from '@/config/env.config'
import Hashing from '@/config/hash.config'
import { logger } from '@/config/httplogger.config'
import { RoleId } from '@/lib/constant/roleIds'

const hashing = new Hashing()

const defaultPassword = env.APP_DEFAULT_PASS
logger.info(`Seed - your default password: ${green(defaultPassword)}`)

const data = [
  {
    fullname: 'Super Admin',
    email: 'super.admin@example.com',
    gender: 'm',
    birthDate: '2004-12-06',
    RoleId: RoleId.admin,
  },
]

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const password = await hashing.hash(defaultPassword)

  const formData: any[] = []

  if (!_.isEmpty(data)) {
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i]

      formData.push({
        ...item,
        id: uuidv4(),
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  await queryInterface.bulkInsert('user', formData)
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.bulkDelete('user', {})
}
