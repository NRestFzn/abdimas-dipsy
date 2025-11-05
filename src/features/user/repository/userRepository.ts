import { Request } from 'express'
import Role from '@/database/model/role'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import User from '@/database/model/user'
import UserDetail from '@/database/model/userDetail'

export class UserRepository {
  //   async getAll(req: Request): Promise<RoleDto[]> {
  //     const query = new RoleQueryRepository(req)

  //     const data = await Role.findAll(query.queryFilter())

  //     return data
  //   }

  async getByPk(id: string): Promise<User> {
    const data = await User.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string) {
    const data = await User.findOne({
      where: { id },
      include: [{ model: UserDetail }],
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  //   async add(formData: CreateRoleDto): Promise<RoleDto> {
  //     let data: any

  //     await db.sequelize!.transaction(async (transaction) => {
  //       data = await Role.create({ ...formData }, { transaction })
  //     })

  //     return data
  //   }

  //   async update(id: string, formData: UpdateRoleDto): Promise<void> {
  //     const data = await this.getByPk(id)

  //     await db.sequelize!.transaction(async (transaction) => {
  //       data.update({ ...formData }, { transaction })
  //     })
  //   }

  //   async delete(id: string): Promise<void> {
  //     const data = await this.getByPk(id)

  //     await data.destroy()
  //   }
}
