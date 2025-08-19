import { Request } from 'express'
import { RukunTetanggaQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'

export class RukunTetanggaQueryRepository extends BaseQueryRequest {
  public name?: number

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as RukunTetanggaQueryFilterDto

    this.name = query.name
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<RukunTetanggaQueryFilterDto>[] = []

    if (this.name) {
      whereCondition.push({
        name: this.name,
      })
    }

    const findCondition = {
      where: {
        [Op.and]: whereCondition,
      },
      limit: this.limit,
      offset: this.offset,
      order: this.order,
    }

    return findCondition
  }
}
