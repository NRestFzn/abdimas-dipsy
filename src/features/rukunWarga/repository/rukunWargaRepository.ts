import { Request } from 'express'
import RukunWarga from '@/database/model/rukunWarga'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { RukunWargaQueryRepository } from './rukunWargaQueryRepository'
import {
  CreateRukunWargaDto,
  RukunWargaDetailDto,
  RukunWargaDto,
  UpdateRukunWargaDto,
} from '../dto'
import RukunTetangga from '@/database/model/rukunTetangga'

export class RukunWargaRepository {
  async getAll(req: Request): Promise<RukunWargaDto[]> {
    const query = new RukunWargaQueryRepository(req)

    const data = await RukunWarga.findAll(query.queryFilter())

    return data
  }

  async getByPk(id: string): Promise<RukunWarga> {
    const data = await RukunWarga.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<RukunWargaDetailDto> {
    const data = await RukunWarga.findOne({
      where: { id },
      include: [{ model: RukunTetangga }],
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found asd')

    return data
  }

  async add(formData: CreateRukunWargaDto): Promise<RukunWargaDto[]> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      const latestRw = await RukunWarga.findOne({
        attributes: ['name'],
        order: [['name', 'DESC']],
      })

      const rwBulkCreate = []

      for (let i = 1; i <= formData.count; i++) {
        rwBulkCreate.push({
          name: (latestRw?.name ? latestRw.name : 0) + i,
        })
      }

      data = await RukunWarga.bulkCreate(rwBulkCreate, { transaction })
    })

    return data
  }

  async update(id: string, formData: UpdateRukunWargaDto): Promise<void> {
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
