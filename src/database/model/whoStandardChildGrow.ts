import { Column, Table } from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'

@Table({ tableName: 'whoStandardChildGrow' })
export default class WhoStandardChildGrow extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.NUMBER })
  month: number

  @Column({ allowNull: false, type: DataTypes.STRING })
  gender: string

  @Column({ allowNull: false, type: DataTypes.DECIMAL(14, 10) })
  L: number

  @Column({ allowNull: false, type: DataTypes.DECIMAL(14, 10) })
  M: number

  @Column({ allowNull: false, type: DataTypes.DECIMAL(14, 10) })
  S: number

  @Column({ allowNull: false, type: DataTypes.DECIMAL(14, 10) })
  type: number
}
