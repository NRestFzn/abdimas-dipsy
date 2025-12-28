import { Request } from 'express'
import Education from '@/database/model/education'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { EducationQueryRepository } from './educationQueryRepository'
import { CreateEducationDto, EducationDto, UpdateEducationDto } from '../dto'

export class EducationRepository {
  async getAll(req: Request): Promise<EducationDto[]> {
    const query = new EducationQueryRepository(req)

    const data = await Education.findAll({
      ...query.queryFilter(),
      order: [['order', 'asc']],
    })

    return data
  }

  async getByPk(id: string): Promise<Education> {
    const data = await Education.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async add(formData: CreateEducationDto): Promise<EducationDto> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await Education.create({ ...formData }, { transaction })
    })

    return data
  }

  async update(id: string, formData: UpdateEducationDto): Promise<void> {
    const data = await this.getByPk(id)

    await db.sequelize!.transaction(async (transaction) => {
      await data.update({ ...formData }, { transaction })
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }
}
