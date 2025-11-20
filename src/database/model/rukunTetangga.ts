import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import RukunWarga from './rukunWarga'
import UserDetail from './userDetail'

@Table({ tableName: 'rukunTetangga' })
export default class RukunTetangga extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.NUMBER })
  name: number

  @IsUUID(4)
  @ForeignKey(() => RukunWarga)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  RukunWargaId: string

  @BelongsTo(() => RukunWarga)
  rukunWarga: RukunWarga

  @HasMany(() => UserDetail)
  userDetails: UserDetail
}
