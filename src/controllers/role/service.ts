import { db } from '@/database/databaseConnection'
import Role from '@/database/model/role'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import { CreateRoleSchema, roleSchema, UpdateRoleSchema } from './schema'

export class RoleService {
  async add(formData: CreateRoleSchema) {
    const values = roleSchema.validateSync(formData)

    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await Role.create(values, { transaction })
    })

    return data
  }

  async getByPk(id: string): Promise<Role> {
    const data = await Role.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getAll(): Promise<Role[]> {
    const data = await Role.findAll()

    return data
  }

  async update(id: string, formData: UpdateRoleSchema): Promise<void> {
    await db.sequelize!.transaction(async (transaction) => {
      const data = await this.getByPk(id)

      await data.update({ ...formData }, { transaction })
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }
}
