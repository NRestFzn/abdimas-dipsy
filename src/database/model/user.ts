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
import RukunWarga from './rukunWarga'
import RukunTetangga from './rukunTetangga'
import MarriageStatus from './marriageStatus'
import Education from './education'
import SalaryRange from './salaryRange'

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
  password: string

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

  @Column({ type: DataType.ENUM('m', 'f'), allowNull: false })
  gender: string

  @Column({ type: DataType.DATEONLY, allowNull: false })
  birthDate: string

  @IsUUID(4)
  @ForeignKey(() => RukunWarga)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  RukunWargaId: string

  @BelongsTo(() => RukunWarga)
  rukunWarga: RukunWarga

  @IsUUID(4)
  @ForeignKey(() => RukunTetangga)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  RukunTetanggaId: string

  @BelongsTo(() => RukunTetangga)
  rukunTetangga: RukunTetangga

  @IsUUID(4)
  @ForeignKey(() => MarriageStatus)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  MarriageStatusId: string

  @BelongsTo(() => MarriageStatus)
  marriageStatus: MarriageStatus

  @IsUUID(4)
  @ForeignKey(() => Education)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  EducationId: string

  @BelongsTo(() => Education)
  education: Education

  @IsUUID(4)
  @ForeignKey(() => SalaryRange)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  SalaryRangeId: string

  @BelongsTo(() => SalaryRange)
  salaryRange: SalaryRange

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
