import { Column, Table } from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'

@Table({ tableName: 'salaryRange' })
export default class SalaryRange extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.DECIMAL(12, 2) })
  minRange: number

  @Column({ allowNull: false, type: DataTypes.DECIMAL(12, 2) })
  maxRange: number
}
