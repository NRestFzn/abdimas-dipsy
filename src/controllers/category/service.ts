import { db } from '@/database/databaseConnection'
import Category from '@/database/model/category'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import {
  CreateCategorySchema,
  categorySchema,
  UpdateCategorySchema,
} from './schema'

export class CategoryService {
  async add(formData: CreateCategorySchema) {
    const values = categorySchema.validateSync(formData)

    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await Category.create(values, { transaction })
    })

    return data
  }

  async getByPk(id: string): Promise<Category> {
    const data = await Category.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getAll(): Promise<Category[]> {
    const data = await Category.findAll()

    return data
  }

  async update(id: string, formData: UpdateCategorySchema): Promise<void> {
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
