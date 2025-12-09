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

export class ResidentRepository {
  async getAll(req: Request): Promise<ResidentDto[]> {
    const query = new ResidentQueryRepository(req)
    const residentDetailQuery = new ResidentDetailQueryRepository(req)

    const data = await User.findAll({
      ...query.queryFilter(),
      include: [
        { model: UserDetail, ...(residentDetailQuery.queryFilter() as any) },
      ],
    })

    return data
  }

  async getByPk(id: string): Promise<User> {
    const data = await User.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<ResidentDetailDto> {
    const data = await User.findOne({
      where: { id },
      include: [
        {
          model: UserDetail,
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

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async add(formData: CreateResidentDto): Promise<void> {
    let data: any

    const duplicateNik = await UserDetail.findOne({
      where: { nik: formData.nik },
    })

    if (duplicateNik)
      throw new ErrorResponse.BaseResponse('Nik already used', 'Conflict', 409)

    const duplicateEmail = await UserDetail.findOne({
      where: { nik: formData.nik },
    })

    if (duplicateEmail)
      throw new ErrorResponse.BaseResponse('Nik already used', 'Conflict', 409)

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
        { ...formData },
        { where: { UserId: data.id }, transaction }
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
