import { Column, Table } from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'

@Table({ tableName: 'category' })
export default class Category extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  name: string
}
