import {
  loginSchema,
  LoginSchema,
  registerSchema,
  RegisterSchema,
} from './schema'
import { db } from '@/database/databaseConnection'
import User from '@/database/model/user'
import { ErrorResponse } from '@/lib/http/ErrorResponse'
import JwtToken from '@/lib/jwtToken'
import { env } from '@/config/env.config'
import { v4 as uuidv4 } from 'uuid'
import { userSchema } from '@/controllers/user/schema'
import { validate } from '@/lib/validate'

const jwt = new JwtToken({ secret: env.JWT_SECRET, expires: env.JWT_EXPIRES })

export class AuthService {
  async login(formData: LoginSchema) {
    const values = loginSchema.validateSync(formData)

    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      const getUser = await User.findOne({
        attributes: ['id', 'fullname', 'email', 'password', 'RoleId'],
        where: { email: values.email },
        transaction,
      })

      if (!getUser) {
        throw new ErrorResponse.NotFound('Invalid credentials')
      }

      const isPasswordMatch = await getUser.comparePassword(values.password)

      if (!isPasswordMatch) {
        throw new ErrorResponse.BadRequest('Invalid credentials')
      }

      const payload = JSON.parse(JSON.stringify({ uid: getUser.id }))

      const { token, expiresIn } = jwt.generate(payload)

      data = {
        fullname: getUser.fullname,
        email: getUser.email,
        uid: getUser.id,
        access_token: token,
        expires_at: new Date(Date.now() + expiresIn * 1000),
        expires_in: expiresIn,
      }
    })

    return data
  }

  async register(formData: RegisterSchema) {
    const values = userSchema.validateSync({
      ...formData,
    })

    // @ts-expect-error
    const formRegister: User = {
      ...values,
    }
    const newUser = await User.create({ ...formRegister })

    const data = await this.login({
      email: newUser.email,
      password: values.newPassword,
    })

    return data
  }
}
