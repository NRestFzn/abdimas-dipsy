import { Request } from 'express'
import { QuestionnaireSubmissionQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'

export class QuestionnaireSubmissionQueryRepository extends BaseQueryRequest {
  public UserId?: string
  public QuestionnaireId?: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as QuestionnaireSubmissionQueryFilterDto

    this.UserId = query.UserId
    this.QuestionnaireId = query.QuestionnaireId
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<QuestionnaireSubmissionQueryFilterDto> =
      {}

    if (this.UserId) {
      whereCondition.UserId = { [Op.like]: `%${this.UserId}%` }
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
