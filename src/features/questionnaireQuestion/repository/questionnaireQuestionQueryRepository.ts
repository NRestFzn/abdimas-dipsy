import { Request } from 'express'
import { QuestionnaireQuestionQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'

export class QuestionnaireQuestionQueryRepository extends BaseQueryRequest {
  public questionText?: string
  public questionType?: string
  public QuestionnaireId?: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as QuestionnaireQuestionQueryFilterDto

    this.questionText = query.questionText
    this.questionType = query.questionType
    this.QuestionnaireId = query.QuestionnaireId
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<QuestionnaireQuestionQueryFilterDto> = {}

    if (this.questionText) {
      whereCondition.questionText = { [Op.like]: `%${this.questionText}%` }
    }

    if (this.questionType) {
      whereCondition.questionType = { [Op.like]: `%${this.questionType}%` }
    }

    if (this.QuestionnaireId) {
      whereCondition.QuestionnaireId = this.QuestionnaireId
    }

    const findCondition = {
      where: whereCondition,
      limit: this.limit,
      offset: this.offset,
      order: this.order,
    }

    return findCondition
  }
}
