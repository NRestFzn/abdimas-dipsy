import { DataTypes } from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

export interface IBaseEntity {
  id?: string
  createdAt: Date
  updatedAt: Date
}

@Table({ tableName: 'base' })
export default class BaseSchema extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string

  @CreatedAt
  @Column({ allowNull: false, type: DataTypes.DATE })
  createdAt!: Date

  @UpdatedAt
  @Column({ allowNull: false, type: DataTypes.DATE })
  updatedAt!: Date
}
