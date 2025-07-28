import { permissionAccess } from '@/middleware/permissionAccess'
import authorization from '@/middleware/authorization'
import express, { Response, Request } from 'express'
import HttpResponse from '@/lib/http/HttpResponse'
import asyncHandler from '@/helper/asyncHandler'
import { RoleId } from '@/lib/constant/roleIds'
import { RoleService } from './service'
import _ from 'lodash'

const service = new RoleService()

const route = express.Router()

route.post(
  '/',
  authorization(),
  permissionAccess([RoleId.admin]),
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    const data = await service.add(values)

    const httpResponse = HttpResponse.created({
      message: 'Data created successfully',
      data,
    })

    res.status(201).json(httpResponse)
  })
)

route.get(
  '/',
  authorization(),
  permissionAccess([RoleId.admin]),
  asyncHandler(async (req: Request, res: Response) => {
    const data = await service.getAll()

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(201).json(httpResponse)
  })
)

route.get(
  '/:id',
  authorization(),
  permissionAccess([RoleId.admin]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await service.getByPk(id)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(201).json(httpResponse)
  })
)

route.delete(
  '/:id',
  authorization(),
  permissionAccess([RoleId.admin]),
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await service.delete(id)

    const httpResponse = HttpResponse.deleted({
      message: 'Data deleted successfully',
    })

    res.status(201).json(httpResponse)
  })
)

route.put(
  '/:id',
  authorization(),
  permissionAccess([RoleId.admin]),
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    const id = req.params.id

    const data = await service.update(id, values)

    const httpResponse = HttpResponse.created({
      message: 'Data updated successfully',
      data,
    })

    res.status(201).json(httpResponse)
  })
)

export { route as RoleHandler }
