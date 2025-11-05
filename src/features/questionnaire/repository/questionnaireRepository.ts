import { Request } from 'express'
import Questionnaire from '@/database/model/questionnaire'
import { db } from '@/database/databaseConnection'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { QuestionnaireQueryRepository } from './questionnaireQueryRepository'
import {
  CreateQuestionnaireDto,
  QuestionnaireDetailDto,
  QuestionnaireDto,
  UpdateQuestionnaireDto,
} from '../dto'
import QuestionnaireQuestion from '@/database/model/questionnaireQuestion'

export class QuestionnaireRepository {
  async getAll(req: Request): Promise<QuestionnaireDto[]> {
    const query = new QuestionnaireQueryRepository(req)

    const data = await Questionnaire.findAll(query.queryFilter())

    return data
  }

  async getAllPublic(req: Request): Promise<QuestionnaireDto[]> {
    const query = new QuestionnaireQueryRepository(req)

    const queryFilter = query.queryFilter()

    queryFilter.where = {
      ...queryFilter.where,
      status: 'publish',
    }

    const data = await Questionnaire.findAll(queryFilter)

    return data
  }

  async getByPk(id: string): Promise<Questionnaire> {
    const data = await Questionnaire.findByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getById(id: string): Promise<QuestionnaireDto> {
    const data = await Questionnaire.findOne({
      where: { id },
      include: [{ model: QuestionnaireQuestion }],
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async getByIdPublic(id: string): Promise<QuestionnaireDetailDto> {
    const data = await Questionnaire.findOne({
      where: { id, status: 'publish' },
      include: [{ model: QuestionnaireQuestion, where: { status: 'publish' } }],
    })

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    return data
  }

  async add(formData: CreateQuestionnaireDto): Promise<QuestionnaireDto[]> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      data = await Questionnaire.create({ ...formData }, { transaction })
    })

    return data
  }

  async update(id: string, formData: UpdateQuestionnaireDto): Promise<void> {
    const data = await this.getByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    await db.sequelize!.transaction(async (transaction) => {
      await data.update({ ...formData }, { transaction })
    })
  }

  async delete(id: string): Promise<void> {
    const data = await this.getByPk(id)

    if (!data) throw new ErrorResponse.NotFound('Data not found')

    await data.destroy()
  }
}
