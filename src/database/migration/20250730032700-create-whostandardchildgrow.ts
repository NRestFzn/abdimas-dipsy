'use strict'

import { DataTypes, QueryInterface } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.createTable('whoStandardChildGrow', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    gender: {
      allowNull: false,
      type: Sequelize.ENUM('m', 'f'),
    },
    month: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    L: {
      allowNull: false,
      type: Sequelize.DECIMAL(14, 10),
    },
    M: {
      allowNull: false,
      type: Sequelize.DECIMAL(14, 10),
    },
    S: {
      allowNull: false,
      type: Sequelize.DECIMAL(14, 10),
    },
    type: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  })
}

export async function down(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.dropTable('whoStandardChildGrow')
}
