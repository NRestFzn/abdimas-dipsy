import asyncHandler from '@/helper/asyncHandler'
import express, { Response, Request, NextFunction } from 'express'
import { ArticleService } from './service'
import HttpResponse from '@/lib/http/HttpResponse'
import authorization from '@/middleware/authorization'
import { FileParams, useMulter } from '@/lib/module/multer'
import _ from 'lodash'

const service = new ArticleService()

const route = express.Router()

const uploadFile = useMulter({
  dest: 'public/uploads',
}).fields([{ name: 'image', maxCount: 1 }])

const setFileToBody = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const file_upload = req.pickSingleFieldMulter(['image'])
    req.setBody(file_upload)
    next()
  }
)

route.post(
  '/',
  authorization(),
  uploadFile,
  setFileToBody,
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    values.publishedDate = null

    const image = _.get(values, 'image', {}) as FileParams

    if (values.status === 'publish') {
      values.publishedDate = new Date()
    }

    const data = await service.add({
      ...values,
      image: `${image.destination.split('/')[1]}/${image.filename}`,
      AuthorId: await req.getState('userLoginState').uid,
    })

    const httpResponse = HttpResponse.created({
      message: 'Article created successfully',
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
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id

    const data = await service.getById(id)

    const httpResponse = HttpResponse.get({
      message: 'Success get data',
      data,
    })

    res.status(200).json(httpResponse)
  })
)

route.put(
  '/:id',
  authorization(),
  uploadFile,
  setFileToBody,
  asyncHandler(async (req: Request, res: Response) => {
    const values = req.getBody()

    values.publishedDate = null

    const id = req.params.id

    const image = _.get(values, 'image', {}) as FileParams

    if (values.status === 'publish') {
      values.publishedDate = new Date()
    }

    const data = await service.update(id, {
      ...values,
      image: `${image.destination.split('/')[1]}/${image.filename}`,
    })

    const httpResponse = HttpResponse.updated({
      message: 'Article updated successfully',
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

export { route as ArticleHandler }
