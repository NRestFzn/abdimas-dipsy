import { Column, HasMany, Table } from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import RukunTetangga from './rukunTetangga'
import User from './user'

@Table({ tableName: 'rukunWarga' })
export default class RukunWarga extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.NUMBER })
  name: number

  @HasMany(() => RukunTetangga)
  rukunTetangga: RukunTetangga[]

  @HasMany(() => User)
  users: User[]
}
