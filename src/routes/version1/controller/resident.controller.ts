import { ResidentRepository } from '@/features/resident/repository/residentRepository'
import { permissionAccess } from '@/middleware/permissionAccess'
import authorization from '@/middleware/authorization'
import express, { Response, Request } from 'express'
import HttpResponse from '@/libs/http/HttpResponse'
import {
  createResidentSchema,
  updateProfileSchema,
  updateResidentSchema,
} from '@/features/resident/schema'
import asyncHandler from '@/helper/asyncHandler'
import { RoleId } from '@/libs/constant/roleIds'
import _ from 'lodash'
import { UserLoginState } from '@/features/user/dto'
import { MulterConfig, useMulter } from '@/libs/module/multer'
import { allowed_image } from '@/src/libs/constant/allowedExtension'
import { Mimetype } from '@/src/libs/constant/allowedMimetype'

const repository = new ResidentRepository()

const route = express.Router()

route.post(
  '/',
  authorization(),
  permissionAccess([RoleId.adminDesa]),
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const values = createResidentSchema.validateSync(formData)

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
  permissionAccess([RoleId.adminDesa]),
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
  '/me',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const user: UserLoginState = req.getState('userLoginState')

    const data = await repository.getById(user.uid)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.put(
  '/me',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const user: UserLoginState = req.getState('userLoginState')

    const formData = req.getBody()

    const value = updateProfileSchema.validateSync(formData, {
      stripUnknown: true,
    })

    const data = await repository.updateByToken(user.uid, value)

    const httpResponse = HttpResponse.updated({
      message: 'Data updated successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/:id',
  authorization(),
  permissionAccess([RoleId.adminDesa]),
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

route.delete(
  '/:id',
  authorization(),
  permissionAccess([RoleId.adminDesa]),
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
  permissionAccess([RoleId.adminDesa]),
  asyncHandler(async (req: Request, res: Response) => {
    let formData = req.getBody()

    const values = updateResidentSchema.validateSync(formData)

    const id = req.params.id

    const data = await repository.update(id, values)

    const httpResponse = HttpResponse.updated({
      message: 'Data updated successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

export { route as ResidentController }
