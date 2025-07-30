import { db } from '@/database/databaseConnection'
import ThreadComment from '@/database/model/threadcomment'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import {
  CreateThreadCommentSchema,
  threadCommentSchema,
  UpdateThreadCommentSchema,
} from './schema'

export class ThreadCommentService {
  async add(formData: CreateThreadCommentSchema) {
    const values = threadCommentSchema.validateSync(formData)

    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await ThreadComment.create(values, { transaction })
    })

    return data
  }

  async getByPk(id: string): Promise<ThreadComment> {
    const data = await ThreadComment.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getAll(): Promise<ThreadComment[]> {
    const data = await ThreadComment.findAll()

    return data
  }

  async update(id: string, formData: UpdateThreadCommentSchema): Promise<void> {
    const data = await this.getByPk(id)

    const values = threadCommentSchema.validateSync({
      ...formData,
      ThreadId: data.ThreadId,
      UserId: data.UserId,
    })

    await db.sequelize!.transaction(async (transaction) => {
      await data.update({ ...values }, { transaction })
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }
}
