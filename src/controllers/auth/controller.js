import router from '@routes/v1'
import AuthService from './service'
import RoleId from '@constants/ConstRole'
import asyncHandler from '@helpers/asyncHandler'
import HttpResponse from '@modules/response/HttpResponse'

router.post(
  '/auth/login',
  asyncHandler(async function login(req, res) {
    const formData = req.body

    const data = await AuthService.login(formData)

    res.status(200).json(data)
  })
)

router.post(
  '/auth/register',
  asyncHandler(async function register(req, res) {
    const formData = req.body

    const txn = await req.transaction

    const data = await AuthService.register(
      {
        ...formData,
        RoleId: RoleId.USER,
      },
      txn
    )

    const httpResponse = HttpResponse.created({ data })

    res.status(200).json(httpResponse)
  })
)
