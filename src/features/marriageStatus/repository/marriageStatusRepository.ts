import { Request } from 'express'
import MarriageStatus from '@/database/model/marriageStatus'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { MarriageStatusQueryRepository } from './marriageStatusQueryRepository'
import {
  CreateMarriageStatusDto,
  MarriageStatusDto,
  UpdateMarriageStatusDto,
} from '../dto'

export class MarriageStatusRepository {
  async getAll(req: Request): Promise<MarriageStatusDto[]> {
    const query = new MarriageStatusQueryRepository(req)

    const data = await MarriageStatus.findAll(query.queryFilter())

    return data
  }

  async getByPk(id: string): Promise<MarriageStatus> {
    const data = await MarriageStatus.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async add(formData: CreateMarriageStatusDto): Promise<MarriageStatusDto> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await MarriageStatus.create({ ...formData }, { transaction })
    })

    return data
  }

  async update(id: string, formData: UpdateMarriageStatusDto): Promise<void> {
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
