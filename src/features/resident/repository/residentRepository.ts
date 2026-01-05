import { Request } from 'express'
import User from '@/database/model/user'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import {
  ResidentDetailQueryRepository,
  ResidentQueryRepository,
} from './residentQueryRepository'
import {
  CreateResidentDto,
  ResidentDetailDto,
  ResidentDto,
  UpdateProfileDto,
  UpdateResidentDto,
} from '../dto'
import UserDetail from '@/database/model/userDetail'
import RukunWarga from '@/database/model/rukunWarga'
import RukunTetangga from '@/database/model/rukunTetangga'
import MarriageStatus from '@/database/model/marriageStatus'
import Education from '@/database/model/education'
import SalaryRange from '@/database/model/salaryRange'
import { RoleId } from '@/libs/constant/roleIds'
import { MetaPaginationDto } from '@/routes/version1/response/metaData'
import UserHasRoles from '@/database/model/userHasRoles'
import Role from '@/database/model/role'
import { AuthRepository } from '../../auth/repository/authRepository'
import { Encryption } from '@/src/libs/encryption'

const authRepository = new AuthRepository()

export class ResidentRepository {
  async getAll(
    req: Request
  ): Promise<{ data: ResidentDto[]; meta: { pagination: MetaPaginationDto } }> {
    const query = new ResidentQueryRepository(req)
    const residentDetailQuery = new ResidentDetailQueryRepository(req)

    const data = await User.findAll({
      ...query.queryFilter(),
      include: [
        {
          model: UserDetail.scope('withNik'),
          ...(residentDetailQuery.queryFilter() as any),
        },
        { model: Role, through: { attributes: [] } },
      ],
    })

    const dataCount = await UserDetail.count()

    return {
      data,
      meta: {
        pagination: {
          page: query.page,
          pageSize: query.pageSize,
          pageCount: data.length,
          total: dataCount,
        },
      },
    }
  }

  async getByPk(id: string): Promise<User> {
    const data = await User.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('errors.notFound')

    return data
  }

  async getById(id: string): Promise<ResidentDetailDto> {
    const data = await User.findOne({
      where: { id },
      include: [
        { model: Role, through: { attributes: [] } },
        {
          model: UserDetail.scope('withNik'),
          include: [
            { model: RukunWarga },
            { model: RukunTetangga },
            { model: MarriageStatus },
            { model: Education },
            { model: SalaryRange },
          ],
        },
      ],
    })

    if (!data) throw new ErrorResponse.NotFound('errors.notFound')

    return data
  }

  async add(formData: CreateResidentDto): Promise<void> {
    let data: any

    const nikBlindIndex = Encryption.hashIndex(formData.nik)

    const duplicateNik = await UserDetail.scope('withNik').findOne({
      where: { nikHash: nikBlindIndex },
    })

    if (duplicateNik)
      throw new ErrorResponse.BaseResponse('auth.nikUsed', 'Conflict', 409)

    if (!formData.email) {
      formData.email = authRepository.createEmailFromFullnameAndNik(
        formData.fullname,
        formData.nik
      )
    }

    const duplicateEmail = await User.findOne({
      where: { email: formData.email },
    })

    if (duplicateEmail)
      throw new ErrorResponse.BaseResponse('auth.emailUsed', 'Conflict', 409)

    if (formData.phoneNumber) {
      const duplicatePhoneNumber = await UserDetail.findOne({
        where: { phoneNumber: formData.phoneNumber },
      })

      if (duplicatePhoneNumber)
        throw new ErrorResponse.BaseResponse('auth.phoneUsed', 'Conflict', 409)
    }

    await db.sequelize!.transaction(async (transaction) => {
      data = await User.create({ ...formData }, { transaction })

      const userRolesData = [
        {
          RoleId: RoleId.user,
          UserId: data.id,
        },
      ]

      if (formData.isKader) {
        userRolesData.push({
          RoleId: RoleId.kaderDesa,
          UserId: data.id,
        })
      }

      await UserHasRoles.bulkCreate(userRolesData, { transaction })

      await UserDetail.create(
        {
          ...formData,
          nikHash: formData.nik,
          nikEncrypted: formData.nik,
          UserId: data.id,
        },
        { transaction }
      )
    })
  }

  async update(id: string, formData: UpdateResidentDto): Promise<void> {
    const data = await this.getByPk(id)

    await db.sequelize!.transaction(async (transaction) => {
      await data.update({ ...formData }, { transaction })

      await UserDetail.update(
        { ...formData, nikHash: formData.nik, nikEncrypted: formData.nik },
        { where: { UserId: data.id }, transaction, individualHooks: true }
      )

      await UserHasRoles.destroy({
        where: { UserId: data.id },
        transaction,
      })

      const userRolesData = [
        {
          RoleId: RoleId.user,
          UserId: data.id,
        },
      ]

      if (formData.isKader) {
        userRolesData.push({
          RoleId: RoleId.kaderDesa,
          UserId: data.id,
        })
      }

      await UserHasRoles.bulkCreate(userRolesData, { transaction })
    })
  }

  async updateByToken(id: string, formData: UpdateProfileDto): Promise<void> {
    const data = await this.getByPk(id)

    await db.sequelize!.transaction(async (transaction) => {
      await data.update({ ...formData }, { transaction })

      await UserDetail.update(
        { ...formData },
        { where: { UserId: data.id }, transaction }
      )
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }
}
