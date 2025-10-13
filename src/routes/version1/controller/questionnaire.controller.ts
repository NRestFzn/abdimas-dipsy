import { QuestionnaireRepository } from '@/features/questionnaire/repository/questionnaireRepository'
import { permissionAccess } from '@/middleware/permissionAccess'
import authorization from '@/middleware/authorization'
import express, { Response, Request } from 'express'
import HttpResponse from '@/libs/http/HttpResponse'
import {
  createQuestionnaireSchema,
  updateQuestionnaireSchema,
} from '@/features/questionnaire/schema'
import asyncHandler from '@/helper/asyncHandler'
import { RoleId } from '@/libs/constant/roleIds'
import _ from 'lodash'

const repository = new QuestionnaireRepository()

const route = express.Router()

route.post(
  '/',
  authorization(),
  permissionAccess([RoleId.adminMedis]),
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const values = createQuestionnaireSchema.validateSync(formData)

    const data = await repository.add(values)

    const httpResponse = HttpResponse.created({
      message: 'Data created successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/',
  authorization(),
  permissionAccess([RoleId.adminMedis]),
  asyncHandler(async (req: Request, res: Response) => {
    const data = await repository.getAll(req)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/public',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const data = await repository.getAllPublic(req)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/:id',
  authorization(),
  permissionAccess([RoleId.adminMedis]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await repository.getById(id)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/:id/public',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await repository.getByIdPublic(id)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.delete(
  '/:id',
  authorization(),
  permissionAccess([RoleId.adminMedis]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await repository.delete(id)

    const httpResponse = HttpResponse.deleted({
      message: 'Data deleted successfully',
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.put(
  '/:id',
  authorization(),
  permissionAccess([RoleId.adminMedis]),
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const values = updateQuestionnaireSchema.validateSync(formData)

    const id = req.params.id

    const data = await repository.update(id, values)

    const httpResponse = HttpResponse.updated({
      message: 'Data updated successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

export { route as QuestionnaireController }
