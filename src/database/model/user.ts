import {
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  Column,
  DataType,
  DefaultScope,
  HasMany,
  HasOne,
  Scopes,
  Table,
  Unique,
} from 'sequelize-typescript'
import Hashing from '@/config/hash.config'
import BaseSchema from './_baseModel'
import Role from './role'
import { DataTypes } from 'sequelize'
import UserDetail from './userDetail'
import UserHasRoles from './userHasRoles'

const hashing = new Hashing()

@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  },
}))
@Scopes(() => ({
  withPassword: {
    attributes: {
      include: ['password'],
    },
  },
}))
@Table({ freezeTableName: true, tableName: 'users' })
export default class User extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  fullname: string

  @Unique
  @Column({ allowNull: false, type: DataTypes.STRING })
  email: string

  @Column({ type: DataTypes.STRING })
  password: string

  @Column({ type: DataType.STRING, allowNull: true })
  profilePicture: string

  @HasOne(() => UserDetail)
  userDetail: UserDetail

  @HasMany(() => UserHasRoles)
  UserHasRoles: UserHasRoles[]

  @BelongsToMany(() => Role, () => UserHasRoles)
  roles!: Role[]

  comparePassword: (current_password: string) => Promise<boolean>

  @BeforeUpdate
  @BeforeCreate
  static async setUserPassword(instance: User): Promise<void> {
    if (instance.password) {
      const hash = await hashing.hash(instance.password)

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
