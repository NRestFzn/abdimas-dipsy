import { Request } from 'express'
import Role from '@/database/model/role'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import { RoleQueryRepository } from './roleQueryRepository'
import { CreateRoleDto, RoleDto, UpdateRoleDto } from '../dto'

export class RoleRepository {
  async getAll(req: Request): Promise<RoleDto[]> {
    const { queryFilter } = new RoleQueryRepository(req)

    console.log(queryFilter())

    const data = await Role.findAll({ ...queryFilter() })

    return data
  }

  async getByPk(id: string): Promise<Role> {
    const data = await Role.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

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
      data.update({ ...formData }, { transaction })
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }
}
