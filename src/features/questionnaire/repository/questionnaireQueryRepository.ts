import { Request } from 'express'
import { QuestionnaireQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'

export class QuestionnaireQueryRepository extends BaseQueryRequest {
  public title?: string
  public description?: string
  public status?: string
  public CategoryId?: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as QuestionnaireQueryFilterDto

    this.title = query.title
    this.description = query.description
    this.status = query.status
    this.CategoryId = query.CategoryId
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<QuestionnaireQueryFilterDto> = {}

    if (this.title) {
      whereCondition.title = { [Op.like]: `%${this.title}%` }
    }

    if (this.description) {
      whereCondition.description = { [Op.like]: `%${this.description}%` }
    }

    if (this.status) {
      whereCondition.status = this.status
    }

    if (this.CategoryId) {
      whereCondition.CategoryId = this.CategoryId
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
