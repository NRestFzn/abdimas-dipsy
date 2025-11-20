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
import User from '@/database/model/user'
import { Op } from 'sequelize'
import UserDetail from '@/src/database/model/userDetail'

export class RukunWargaRepository {
  async getAll(req: Request): Promise<{
    data: RukunWargaDto[]
    metaData: { rwCount: number; rtCount: number; userCount: number }
  }> {
    const query = new RukunWargaQueryRepository(req)

    const data = await RukunWarga.findAll(query.queryFilter())

    const rtCount = await RukunTetangga.count({
      where: { RukunWargaId: { [Op.in]: data.map((e) => e.id) } },
    })

    const userCount = await UserDetail.count({
      where: { RukunWargaId: { [Op.in]: data.map((e) => e.id) } },
    })

    return {
      data,
      metaData: {
        rwCount: data.length,
        rtCount,
        userCount,
      },
    }
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
