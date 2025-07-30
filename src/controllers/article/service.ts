import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import { CreateArticleType, UpdateArticleType, articleSchema } from './schema'
import Article from '@/database/model/article'
import Category from '@/database/model/category'
import User from '@/database/model/user'

export class ArticleService {
  async add(formData: CreateArticleType) {
    const values = articleSchema.validateSync(formData)

    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await Article.create(values, { transaction })
    })

    return data
  }

  async getByPk(id: string): Promise<Article> {
    const data = await Article.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<Article> {
    const data = await Article.findOne({
      where: { id },
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'fullname'] },
      ],
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getAll(): Promise<Article[]> {
    const data = await Article.findAll({
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'fullname'] },
      ],
    })

    return data
  }

  async update(id: string, formData: UpdateArticleType) {
    const article = await this.getByPk(id)

    const values = articleSchema.validateSync({
      ...formData,
      AuthorId: article.AuthorId,
    })

    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await article.update(
        { ...values, AuthorId: article.AuthorId },
        { transaction }
      )
    })

    return data
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }
}
