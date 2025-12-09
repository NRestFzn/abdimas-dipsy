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
import QuestionnaireSubmission from '@/src/database/model/questionnaireSubmission'
import { UserLoginState } from '../../user/dto'

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

  async getAllAvailabilityByUserId(req: Request) {
    const user: UserLoginState = req.getState('userLoginState')

    const query = new QuestionnaireQueryRepository(req)

    const queryFilter = query.queryFilter()

    queryFilter.where = {
      ...queryFilter.where,
      status: 'publish',
    }

    const questionnaires = await Questionnaire.findAll({
      ...queryFilter,
      include: [
        {
          model: QuestionnaireSubmission,
          where: { UserId: user.uid },
          required: false,
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      ],
    })

    const data = questionnaires.map((q) => {
      const latestSubmission =
        q.submissions && q.submissions.length > 0 ? q.submissions[0] : null

      let isAvailable = true

      let availableAt = null

      if (latestSubmission) {
        const now = new Date()

        const lastSubmitTime = new Date(latestSubmission.createdAt)

        const cooldownMinutes = q.cooldownInMinutes

        const nextAvailableTime = new Date(
          lastSubmitTime.getTime() + cooldownMinutes * 60000
        )

        if (now < nextAvailableTime) {
          isAvailable = false
          availableAt = nextAvailableTime
        }
      }

      return {
        ...q.toJSON(),
        isAvailable,
        availableAt,
        latestSubmission: latestSubmission ? latestSubmission.createdAt : null,
      }
    })

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
