import { Request } from 'express'
import Role from '@/database/model/role'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { RoleQueryRepository } from './roleQueryRepository'
import { CreateRoleDto, RoleDto, UpdateRoleDto } from '../dto'
import { MetaPaginationDto } from '@/routes/version1/response/metaData'

export class RoleRepository {
  async getAll(
    req: Request
  ): Promise<{ data: RoleDto[]; meta: { pagination: MetaPaginationDto } }> {
    const query = new RoleQueryRepository(req)

    const data = await Role.findAll(query.queryFilter())

    const dataCount = await Role.count()

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

  async getByPk(id: string): Promise<Role> {
    const data = await Role.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('errors.notFound')

    return data
  }

  async add(formData: CreateRoleDto): Promise<RoleDto> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await Role.create({ ...formData }, { transaction })
    })

    return data
  }

  async update(id: string, formData: UpdateRoleDto): Promise<void> {
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
