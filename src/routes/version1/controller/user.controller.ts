import { UserRepository } from '@/features/user/repository/userRepository'
import authorization from '@/middleware/authorization'
import express, { Response, Request } from 'express'
import HttpResponse from '@/libs/http/HttpResponse'
import asyncHandler from '@/helper/asyncHandler'
import _ from 'lodash'
import { UserLoginState } from '@/features/user/dto'
import { updateUserSchema, UpdateUserSchema } from '@/features/user/schema'
import { Mimetype } from '@/libs/constant/allowedMimetype'
import { allowed_image } from '@/libs/constant/allowedExtension'
import { MulterConfig, useMulter } from '@/libs/module/multer'

const repository = new UserRepository()

const route = express.Router()

const mimeType = new Mimetype()

const multerConfig: MulterConfig = {
  allowed_ext: allowed_image,
  allowed_mimetype: mimeType.image,
}

const uploadFile = useMulter(multerConfig)

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

    const formData: UpdateUserSchema = req.getBody()

    const value = updateUserSchema.validateSync(formData)

    const data = await repository.update(user.uid, value)

    const httpResponse = HttpResponse.updated({
      message: 'Data updated successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.put(
  '/update/profile-picture',
  authorization(),
  uploadFile.single('profilePicture'),
  asyncHandler(async (req: Request, res: Response) => {
    const user: UserLoginState = req.getState('userLoginState')

    const file = req.file as Express.Multer.File

    const data = await repository.updateProfilePict(user.uid, file.filename)

    const httpResponse = HttpResponse.updated({
      message: 'Data updated successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

export { route as UserController }
