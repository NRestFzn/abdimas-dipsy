import { db } from '@/database/databaseConnection'
import Thread from '@/database/model/thread'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import { CreateThreadSchema, threadSchema, UpdateThreadSchema } from './schema'
import User from '@/database/model/user'
import ThreadComment from '@/database/model/threadcomment'

export class ThreadService {
  async add(formData: CreateThreadSchema) {
    const values = threadSchema.validateSync(formData)

    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await Thread.create(values, { transaction })
    })

    return data
  }

  async getByPk(id: string): Promise<Thread> {
    const data = await Thread.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<Thread> {
    const data = await Thread.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'fullname'] },
        {
          model: ThreadComment,
          include: [{ model: User, attributes: ['id', 'fullname'] }],
        },
      ],
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getAll(): Promise<Thread[]> {
    const data = await Thread.findAll({
      include: [{ model: User, attributes: ['id', 'fullname'] }],
    })

    return data
  }

  async update(id: string, formData: UpdateThreadSchema): Promise<void> {
    const values = threadSchema.validateSync(formData)

    await db.sequelize!.transaction(async (transaction) => {
      const data = await this.getByPk(id)

      await data.update({ ...values }, { transaction })
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }
}
