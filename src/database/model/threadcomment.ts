import {
  BelongsTo,
  Column,
  ForeignKey,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import User from './user'
import Thread from './thread'

@Table({ tableName: 'threadComment' })
export default class ThreadComment extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  message: string

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  UserId: string

  @BelongsTo(() => User)
  user: User

  @IsUUID(4)
  @ForeignKey(() => Thread)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  ThreadId: string

  @BelongsTo(() => Thread)
  thread: Thread
}
