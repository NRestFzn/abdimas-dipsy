import { Request } from 'express'
import QuestionnaireQuestion from '@/database/model/questionnaireQuestion'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { QuestionnaireQuestionQueryRepository } from './questionnaireQuestionQueryRepository'
import {
  CreateQuestionnaireQuestionDto,
  QuestionnaireQuestionDto,
  UpdateQuestionnaireQuestionDto,
} from '../dto'

export class QuestionnaireQuestionRepository {
  async getAll(req: Request): Promise<QuestionnaireQuestionDto[]> {
    const query = new QuestionnaireQuestionQueryRepository(req)

    const data = await QuestionnaireQuestion.findAll(query.queryFilter())

    return data
  }

  async getByPk(id: string): Promise<QuestionnaireQuestion> {
    const data = await QuestionnaireQuestion.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<QuestionnaireQuestionDto> {
    const data = await QuestionnaireQuestion.findOne({
      where: { id },
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async add(
    formData: CreateQuestionnaireQuestionDto
  ): Promise<QuestionnaireQuestionDto[]> {
    let data: any

    const maxOrder = await QuestionnaireQuestion.findOne({
      attributes: ['order'],
      order: [['order', 'desc']],
      limit: 1,
    })

    await db.sequelize!.transaction(async (transaction) => {
      const order = (maxOrder?.order ? maxOrder.order : 0) + 1
      data = await QuestionnaireQuestion.create(
        { ...formData, order },
        { transaction }
      )
    })

    return data
  }

  async update(formData: UpdateQuestionnaireQuestionDto[]): Promise<void> {
    const bulkUpdate: any[] = []

    const duplicateOrder = this.checkDuplicateOrder(formData)

    if (duplicateOrder)
      throw new ErrorResponse.BadRequest('Duplicate order found')

    for (let i = 0; i < formData.length; i++) {
      const { id, questionText, questionType, order, status } = formData[i]

      const data = await this.getByPk(id)

      bulkUpdate.push({
        id: data.id,
        questionText,
        questionType,
        status,
        order,
        QuestionnaireId: data.QuestionnaireId,
      })
    }

    await db.sequelize!.transaction(async (transaction) => {
      await QuestionnaireQuestion.bulkCreate(bulkUpdate, {
        transaction,
        updateOnDuplicate: [
          'id',
          'questionText',
          'questionType',
          'order',
          'status',
          'QuestionnaireId',
        ],
      })
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    await data.destroy()
  }

  checkDuplicateOrder(formData: UpdateQuestionnaireQuestionDto[]): boolean {
    const checkedOrder = new Set()

    for (const data of formData) {
      if (checkedOrder.has(data.order)) {
        return true
      }

      checkedOrder.add(data.order)
    }

    return false
  }
}
