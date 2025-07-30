import asyncHandler from '@/helper/asyncHandler'
import express, { Response, Request } from 'express'
import { AuthService } from './service'
import HttpResponse from '@/lib/http/HttpResponse'
import { RoleId } from '@/lib/constant/roleIds'

const service = new AuthService()

const route = express.Router()

route.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    const data = await service.register({ ...values, RoleId: RoleId.user })

    const httpResponse = HttpResponse.created({
      message: 'User registered successfully',
      data,
    })

    res.status(201).json(httpResponse)
  })
)

route.post(
  '/signin',
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    const data = await service.login(values)

    const httpResponse = HttpResponse.get({
      message: 'Login successfully',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

export { route as AuthHandler }
