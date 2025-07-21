import routes from '@routes/v1'
import categoryService from './service'
import RoleId from '@constants/ConstRole'
import asyncHandler from '@helpers/asyncHandler'
import permissions from '@middlewares/permission'
import authorization from '@middlewares/authorization'
import HttpResponse from '@modules/response/HttpResponse'

routes.get(
  '/category',
  asyncHandler(async (req, res) => {
    const data = await categoryService.findAll(req)

    const httpResponse = HttpResponse.get(data)

    res.status(200).json(httpResponse)
  })
)

routes.get(
  '/category/:id',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const data = await categoryService.findById(id)

    const httpResponse = HttpResponse.get({ data })

    res.status(200).json(httpResponse)
  })
)

routes.post(
  '/category',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const formData = req.body

    const txn = await req.transaction

    const data = await categoryService.create(formData, txn)

    const httpResponse = HttpResponse.created({ data })

    res.status(201).json(httpResponse)
  })
)

routes.put(
  '/category/:id',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const txn = await req.transaction

    const formData = req.body

    await categoryService.update(id, formData, txn)

    const httpResponse = HttpResponse.updated()

    res.status(200).json(httpResponse)
  })
)

routes.delete(
  '/category/:id',
  authorization,
  permissions([RoleId.ADMIN]),
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const txn = await req.transaction

    await categoryService.delete(id, txn)

    const httpResponse = HttpResponse.deleted()

    res.status(200).json(httpResponse)
  })
)
