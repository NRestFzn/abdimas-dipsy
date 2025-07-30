import { permissionAccess } from '@/middleware/permissionAccess'
import authorization from '@/middleware/authorization'
import express, { Response, Request } from 'express'
import HttpResponse from '@/lib/http/HttpResponse'
import asyncHandler from '@/helper/asyncHandler'
import { RoleId } from '@/lib/constant/roleIds'
import { ThreadCommentService } from './service'
import _ from 'lodash'

const service = new ThreadCommentService()

const route = express.Router()

route.post(
  '/',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    const data = await service.add({
      ...values,
      UserId: req.getState('userLoginState').uid,
    })

    const httpResponse = HttpResponse.created({
      message: 'Data created successfully',
      data,
    })

    res.status(201).json(httpResponse)
  })
)

route.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const data = await service.getAll()

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

route.get(
  '/:id',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await service.getByPk(id)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

route.delete(
  '/:id',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await service.delete(id)

    const httpResponse = HttpResponse.deleted({
      message: 'Data deleted successfully',
    })

    res.status(200).json(httpResponse)
  })
)

route.put(
  '/:id',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    const id = req.params.id

    const data = await service.update(id, {
      ...values,
      UserId: req.getState('userLoginState').uid,
    })

    const httpResponse = HttpResponse.updated({
      message: 'Data updated successfully',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

export { route as ThreadCommentHandler }
