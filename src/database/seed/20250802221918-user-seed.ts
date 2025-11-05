'use strict'

import { green } from 'colorette'
import _ from 'lodash'
import { DataTypes, QueryInterface, QueryTypes } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import { env } from '@/config/env.config'
import Hashing from '@/config/hash.config'
import { logger } from '@/config/httplogger.config'
import { RoleId } from '@/libs/constant/roleIds'

const hashing = new Hashing()

const defaultPassword = env.APP_DEFAULT_PASS
logger.info(`Seed - your default password: ${green(defaultPassword)}`)

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  const education: { id: string }[] = await queryInterface.sequelize.query(
    'SELECT id FROM `education` LIMIT 1',
    { type: QueryTypes.SELECT }
  )
  const rukunWarga: { id: string }[] = await queryInterface.sequelize.query(
    'SELECT id FROM `rukunWarga` LIMIT 1',
    { type: QueryTypes.SELECT }
  )
  const rukunTetangga: { id: string }[] = await queryInterface.sequelize.query(
    'SELECT id FROM `rukunTetangga` LIMIT 1',
    { type: QueryTypes.SELECT }
  )
  const marriageStatus: { id: string }[] = await queryInterface.sequelize.query(
    'SELECT id FROM `marriageStatus` LIMIT 1',
    { type: QueryTypes.SELECT }
  )
  const salaryRange: { id: string }[] = await queryInterface.sequelize.query(
    'SELECT id FROM `salaryRange` LIMIT 1',
    { type: QueryTypes.SELECT }
  )

  const data: any[] = [
    {
      fullname: 'Admin Medis',
      email: 'admin.medis@example.com',
      gender: 'm',
      birthDate: '2004-12-06',
      RoleId: RoleId.adminMedis,
      password: await hashing.hash(defaultPassword),
    },
    {
      fullname: 'Admin Desa',
      email: 'admin.desa@example.com',
      gender: 'm',
      birthDate: '2004-12-06',
      RoleId: RoleId.adminDesa,
      password: await hashing.hash(defaultPassword),
    },
    {
      fullname: 'user',
      email: 'user@example.com',
      gender: 'm',
      birthDate: '2004-12-06',
      RoleId: RoleId.user,
      password: await hashing.hash(defaultPassword),
    },
  ]

  const formData: any[] = []

  if (!_.isEmpty(data)) {
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i]

      formData.push({
        ...item,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  await queryInterface.bulkInsert('user', formData)
  await queryInterface.bulkInsert('userDetail', [
    {
      id: uuidv4(),
      UserId: formData[2].id,
      EducationId: education[0].id,
      MarriageStatusId: marriageStatus[0].id,
      RukunTetanggaId: rukunTetangga[0].id,
      RukunWargaId: rukunWarga[0].id,
      SalaryRangeId: salaryRange[0].id,
      profession: 'programmer',
      nik: '3204544444444444',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.bulkDelete('user', {})
}
