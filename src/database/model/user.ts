import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  IsUUID,
  Scopes,
  Table,
  Unique,
} from 'sequelize-typescript'
import Hashing from '@/config/hash.config'
import BaseSchema from './_baseModel'
import Role from './role'
import { DataTypes } from 'sequelize'

const hashing = new Hashing()

@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  },
}))
@Scopes(() => ({
  withPassword: {},
}))
@Table({ tableName: 'user' })
export default class User extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  fullname: string

  @Unique
  @Column({ allowNull: false, type: DataTypes.STRING })
  email: string

  @Column({ type: DataTypes.STRING })
  password?: string

  @IsUUID(4)
  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  RoleId: string

  @BelongsTo(() => Role)
  role: Role

  @Column({ type: DataType.VIRTUAL })
  newPassword: string

  @Column({ type: DataType.VIRTUAL })
  confirmNewPassword: string

  comparePassword: (current_password: string) => Promise<boolean>

  @BeforeUpdate
  @BeforeCreate
  static async setUserPassword(instance: User): Promise<void> {
    const { newPassword } = instance

    if (newPassword) {
      const hash = await hashing.hash(instance.newPassword)
      instance.setDataValue('password', hash)
    }
  }
}

// compare password
User.prototype.comparePassword = async function (
  current_password: string
): Promise<boolean> {
  const password = String(this.password)

  const compare = await hashing.verify(password, current_password)
  return compare
}
