import { Column, Table } from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'

@Table({ tableName: 'role' })
export default class Role extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  name: string
}
