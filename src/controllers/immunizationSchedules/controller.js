import routes from '@routes/v1'
import childService from './service'
import RoleId from '@constants/ConstRole'
import asyncHandler from '@helpers/asyncHandler'
import permissions from '@middlewares/permission'
import authorization from '@middlewares/authorization'
import HttpResponse from '@modules/response/HttpResponse'

routes.get(
  '/immunization-schedule',
  asyncHandler(async (req, res) => {
    const data = await childService.findAll(req)

    const httpResponse = HttpResponse.get(data)

    res.status(200).json(httpResponse)
  })
)

routes.get(
  '/immunization-schedule/:id',
  authorization,
  asyncHandler(async (req, res) => {
    const { id } = req.params
    const data = await childService.findById(id)

    const httpResponse = HttpResponse.get({ data })

    res.status(200).json(httpResponse)
  })
)

routes.post(
  '/immunization-schedule',
  authorization,
  asyncHandler(async (req, res) => {
    const formData = req.body

    const txn = await req.transaction

    const user = req.user

    const data = await childService.create(
      { ...formData, ParentId: user.id },
      txn
    )

    const httpResponse = HttpResponse.created({ data })

    res.status(201).json(httpResponse)
  })
)

routes.put(
  '/immunization-schedule/:id',
  authorization,
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const txn = await req.transaction

    const formData = req.body

    await childService.update(id, formData, txn)

    const httpResponse = HttpResponse.updated()

    res.status(200).json(httpResponse)
  })
)

routes.delete(
  '/immunization-schedule/:id',
  authorization,
  asyncHandler(async (req, res) => {
    const { id } = req.params

    const txn = await req.transaction

    await childService.delete(id, txn)

    const httpResponse = HttpResponse.deleted()

    res.status(200).json(httpResponse)
  })
)
