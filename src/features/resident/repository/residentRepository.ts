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
      ],
    })

    const dataCount = await User.count({
      where: { RoleId: RoleId.user },
    })

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

    const duplicateNik = await UserDetail.findOne({
      where: { nik: formData.nik },
    })

    if (duplicateNik)
      throw new ErrorResponse.BaseResponse('auth.nikUsed', 'Conflict', 409)

    const duplicateEmail = await UserDetail.findOne({
      where: { nik: formData.nik },
    })

    if (duplicateEmail)
      throw new ErrorResponse.BaseResponse('auth.nikUsed', 'Conflict', 409)

    await db.sequelize!.transaction(async (transaction) => {
      data = await User.create(
        { ...formData, RoleId: RoleId.user },
        { transaction }
      )

      await UserDetail.create({ ...formData, UserId: data.id }, { transaction })
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
