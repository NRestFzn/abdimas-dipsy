import { Request } from 'express'
import { ResidentQueryFilterDto } from '../dto'
import { FindOptions, WhereOptions, Op } from 'sequelize'
import { BaseQueryRequest } from '@/routes/version1/request/_baseQueryRequest'
import { RoleId } from '@/libs/constant/roleIds'

export class ResidentQueryRepository extends BaseQueryRequest {
  public fullname?: string

  constructor(req: Request) {
    super(req)

    const query = req.query as unknown as ResidentQueryFilterDto

    this.fullname = query.fullname
  }

  public queryFilter(): FindOptions {
    const whereCondition: WhereOptions<ResidentQueryFilterDto>[] = []

    whereCondition.push({
      RoleId: RoleId.user,
    })

    if (this.fullname) {
      whereCondition.push({
        fullname: {
          [Op.like]: `%${this.fullname}%`,
        },
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
