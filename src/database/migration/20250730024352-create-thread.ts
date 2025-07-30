'use strict'

import { DataTypes, QueryInterface } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up(
  queryInterface: QueryInterface,
  Sequelize: typeof DataTypes
) {
  await queryInterface.createTable('thread', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    description: {
      allowNull: false,
      type: Sequelize.TEXT,
    },
    publishedDate: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    status: {
      allowNull: false,
      type: Sequelize.ENUM('draft', 'publish'),
    },
    AuthorId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
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
  await queryInterface.dropTable('thread')
}
