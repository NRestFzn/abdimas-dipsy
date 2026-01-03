import { Request } from 'express'
import QuestionnaireCategory from '@/database/model/questionnaireCategory'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { QuestionnaireCategoryQueryRepository } from './questionnaireCategoryQueryRepository'
import {
  CreateQuestionnaireCategoryDto,
  QuestionnaireCategoryDto,
  UpdateQuestionnaireCategoryDto,
} from '../dto'
import { MetaPaginationDto } from '@/routes/version1/response/metaData'

export class QuestionnaireCategoryRepository {
  async getAll(req: Request): Promise<{
    data: QuestionnaireCategoryDto[]
    meta: { pagination: MetaPaginationDto }
  }> {
    const query = new QuestionnaireCategoryQueryRepository(req)

    const data = await QuestionnaireCategory.findAll(query.queryFilter())

    const dataCount = await QuestionnaireCategory.count()

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

  async getByPk(id: string): Promise<QuestionnaireCategory> {
    const data = await QuestionnaireCategory.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async add(
    formData: CreateQuestionnaireCategoryDto
  ): Promise<QuestionnaireCategoryDto> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await QuestionnaireCategory.create(
        { ...formData },
        { transaction }
      )
    })

    return data
  }

  async update(
    id: string,
    formData: UpdateQuestionnaireCategoryDto
  ): Promise<void> {
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
