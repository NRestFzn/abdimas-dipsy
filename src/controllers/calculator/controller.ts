import asyncHandler from '@/helper/asyncHandler'
import express, { Response, Request } from 'express'
import { CalcService } from './service'
import HttpResponse from '@/lib/http/HttpResponse'

const service = new CalcService()

const route = express.Router()

route.get(
  '/daily-nutrition',
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    const data = service.calculateDailyNutrition(values)

    const httpResponse = HttpResponse.get({
      message: 'Success calculate daily nutrition',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

route.get(
  '/child-grow',
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    const data = await service.checkChildGrow(values)

    const httpResponse = HttpResponse.get({
      message: 'Success check child grow',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

export { route as CalculatorHandler }
