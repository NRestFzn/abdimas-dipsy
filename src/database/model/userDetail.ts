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
} from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import RukunWarga from './rukunWarga'
import RukunTetangga from './rukunTetangga'
import MarriageStatus from './marriageStatus'
import Education from './education'
import SalaryRange from './salaryRange'
import User from './user'
import { Encryption } from '@/libs/encryption'
import Role from './role'
import { RoleId } from '@/libs/constant/roleIds'

@DefaultScope(() => ({
  attributes: {
    exclude: ['nikHash', 'nikEncrypted'],
  },
}))
@Scopes(() => ({
  withNik: {
    attributes: { include: ['nikEncrypted'], exclude: ['nikHash'] },
  },
}))
@Table({ freezeTableName: true, tableName: 'user_details' })
export default class UserDetail extends BaseSchema {
  @Column({ type: DataType.STRING, allowNull: false })
  nikHash: string

  @Column({ type: DataType.STRING, allowNull: false })
  nikEncrypted: string

  @Column({ type: DataType.STRING, allowNull: false })
  profession: string

  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  phoneNumber: string

  @Column({ type: DataType.ENUM('m', 'f'), allowNull: false })
  gender: string

  @Column({ type: DataType.DATEONLY, allowNull: false })
  birthDate: Date

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isKader: boolean

  @Column({ type: DataType.VIRTUAL })
  get nik(): string | null {
    const encrypted = this.getDataValue('nikEncrypted')
    if (!encrypted) return null

    if (!encrypted.includes(':')) {
      return encrypted
    }

    const decrypted = Encryption.decrypt(encrypted)

    const maskLength = decrypted.length - 8

    return decrypted.slice(0, 4) + '*'.repeat(maskLength) + decrypted.slice(-4)
  }

  set nik(value: string) {
    this.setDataValue('nik', value)
  }

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  UserId: string

  @BelongsTo(() => User)
  user: User

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

  compareNik: (current_nik: string) => Promise<boolean>

  get(options?: any) {
    const values = super.get(options)

    if (!values) return values

    delete values.nikEncrypted
    delete values.nikHash

    return values
  }

  @BeforeUpdate
  @BeforeCreate
  static async encryptNikResident(instance: UserDetail): Promise<void> {
    if (instance.changed('nikEncrypted')) {
      const value = instance.getDataValue('nikEncrypted')

      if (value && value.includes('*')) {
        const oldVal = instance.previous('nikEncrypted')
        instance.setDataValue('nikEncrypted', oldVal)
        return
      }

      const encrypt = Encryption.encrypt(value)
      instance.setDataValue('nikEncrypted', encrypt)
    }
  }

  @BeforeUpdate
  @BeforeCreate
  static async hashNikResident(instance: UserDetail): Promise<void> {
    if (instance.changed('nikHash')) {
      const value = instance.getDataValue('nikHash')

      if (value && value.includes('*')) {
        const oldVal = instance.previous('nikHash')
        instance.setDataValue('nikHash', oldVal)
        return
      }

      const blindIndex = Encryption.hashIndex(value)
      instance.setDataValue('nikHash', blindIndex)
    }
  }
}

UserDetail.prototype.compareNik = async function (
  current_nik: string
): Promise<boolean> {
  const inputHash = Encryption.hashIndex(current_nik)
  return this.nikHash === inputHash
}
