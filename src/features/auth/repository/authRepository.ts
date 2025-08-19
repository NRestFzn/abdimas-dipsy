import { db } from '@/database/databaseConnection'
import User from '@/database/model/user'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import JwtToken from '@/libs/jwtToken'
import { env } from '@/config/env.config'
import { AuthResponseDto, LoginDto, RegisterDto } from '../dto'
import { RoleId } from '@/libs/constant/roleIds'

const jwt = new JwtToken({ secret: env.JWT_SECRET, expires: env.JWT_EXPIRES })

export class AuthService {
  async login(formData: LoginDto): Promise<AuthResponseDto> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      const getUser = await User.findOne({
        attributes: ['id', 'fullname', 'email', 'password', 'RoleId'],
        where: { email: formData.email },
        transaction,
      })

      if (!getUser) {
        throw new ErrorResponse.NotFound('Invalid credentials')
      }

      const isPasswordMatch = await getUser.comparePassword(formData.password)

      if (!isPasswordMatch) {
        throw new ErrorResponse.BadRequest('Invalid credentials')
      }

      const payload = JSON.parse(JSON.stringify({ uid: getUser.id }))

      const { token, expiresIn } = jwt.generate(payload)

      data = {
        fullname: getUser.fullname,
        email: getUser.email,
        uid: getUser.id,
        accessToken: token,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        expiresIn: expiresIn,
      }
    })

    return data
  }

  async register(formData: RegisterDto): Promise<AuthResponseDto> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      const duplicateEmail = await User.findOne({
        where: { email: formData.email },
        transaction,
      })

      if (duplicateEmail)
        throw new ErrorResponse.BaseResponse(
          'Email already used',
          'Conflict',
          409
        )

      data = await User.create(
        { ...formData, RoleId: RoleId.user },
        { transaction }
      )
    })

    data = await this.login({
      email: data.email,
      password: formData.password,
    })

    return data
  }
}
