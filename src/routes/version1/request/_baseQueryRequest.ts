import { red } from 'colorette'
import { Request } from 'express'
import { Order } from 'sequelize'

export class BaseQueryRequest {
  public limit: number
  public offset: number
  public order: Order
  public page: number
  public pageSize: number

  constructor(req: Request) {
    const { query } = req

    this.page = query.page ? Number(query.page) : 1

    this.pageSize = query.pageSize ? Number(query.pageSize) : 10

    this.limit = query.pageSize ? Number(query.pageSize) : 10

    const page = query.page ? Number(query.page) : 1

    this.offset = (page - 1) * this.limit

    if (query.order && typeof query.order === 'string') {
      try {
        this.order = JSON.parse(query.order)
      } catch (error) {
        console.log(`${red('Invalid Input')} : Failed to parse string input`)
        this.order = [['createdAt', 'DESC']]
      }
    } else {
      this.order = [['createdAt', 'DESC']]
    }
  }
}
