import { Request } from 'express'
import RukunTetangga from '@/database/model/rukunTetangga'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { RukunTetanggaQueryRepository } from './rukunTetanggaQueryRepository'
import {
  CreateRukunTetanggaDto,
  RukunTetanggaDetailDto,
  RukunTetanggaDto,
  UpdateRukunTetanggaDto,
} from '../dto'
import { RukunWargaRepository } from '@/features/rukunWarga/repository/rukunWargaRepository'
import User from '@/database/model/user'
import UserDetail from '@/database/model/userDetail'

const rukunWargaRepository = new RukunWargaRepository()

export class RukunTetanggaRepository {
  async getAll(req: Request): Promise<RukunTetanggaDto[]> {
    const query = new RukunTetanggaQueryRepository(req)

    const data = await RukunTetangga.findAll(query.queryFilter())

    return data
  }

  async getByPk(id: string): Promise<RukunTetangga> {
    const data = await RukunTetangga.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<RukunTetanggaDetailDto> {
    const data = await RukunTetangga.findOne({
      where: { id },
      include: [{ model: UserDetail, include: [{ model: User }] }],
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async add(formData: CreateRukunTetanggaDto): Promise<RukunTetanggaDto[]> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      const latestRt = await RukunTetangga.findOne({
        attributes: ['name'],
        order: [['name', 'DESC']],
      })

      const rw = await rukunWargaRepository.getByPk(formData.RukunWargaId)

      const rwBulkCreate = []

      for (let i = 1; i <= formData.count; i++) {
        rwBulkCreate.push({
          name: (latestRt?.name ? latestRt.name : 0) + i,
          RukunWargaId: rw.id,
        })
      }

      data = await RukunTetangga.bulkCreate(rwBulkCreate, { transaction })
    })

    return data
  }

  async update(id: string, formData: UpdateRukunTetanggaDto): Promise<void> {
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
