import routes from '@routes/v1'
import asyncHandler from '@helpers/asyncHandler'
import CalcService from './service'
import permissions from '@middlewares/permission'
import authorization from '@middlewares/authorization'
import HttpResponse from '@modules/response/HttpResponse'
import RoleId from '@constants/ConstRole'

routes.get(
  '/calc/daily-nutrition',
  asyncHandler(async (req, res) => {
    const formData = req.body

    const data = CalcService.calculateDailyNutrition(formData)

    const httpResponse = HttpResponse.get({ data })

    res.status(200).json(httpResponse)
  })
)

routes.get(
  '/calc/child-grow',
  asyncHandler(async (req, res) => {
    const formData = req.body

    const data = await CalcService.checkChildGrow(formData)

    const httpResponse = HttpResponse.get({ data })

    res.status(200).json(httpResponse)
  })
)
