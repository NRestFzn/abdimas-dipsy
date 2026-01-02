import { db } from '@/database/databaseConnection'
import User from '@/database/model/user'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import JwtToken from '@/libs/jwtToken'
import { env } from '@/config/env.config'
import { AuthResponseDto, LoginDto, LoginWithNikDto, RegisterDto } from '../dto'
import { RoleId } from '@/libs/constant/roleIds'
import UserDetail from '@/database/model/userDetail'
import { Encryption } from '@/libs/encryption'

const jwt = new JwtToken({ secret: env.JWT_SECRET, expires: env.JWT_EXPIRES })

export class AuthService {
  private createEmailFromFullnameAndNik(fullname: string, nik: string): string {
    const nameForEmail = fullname.toLowerCase().split(' ').slice(0, 2).join('')
    const lastDigitNik = nik.slice(-4)
    return `${nameForEmail}.${lastDigitNik}@cibiru.wetan`
  }

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

      const payload = JSON.parse(
        JSON.stringify({ uid: getUser.id, RoleId: getUser.RoleId })
      )

      const { token, expiresIn } = jwt.generate(payload)

      data = {
        fullname: getUser.fullname,
        email: getUser.email,
        RoleId: getUser.RoleId,
        uid: getUser.id,
        accessToken: token,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        expiresIn: expiresIn,
      }
    })

    return data
  }

  async loginWithNik(formData: LoginWithNikDto): Promise<AuthResponseDto> {
    const getUser = await UserDetail.findOne({
      where: { nikHash: Encryption.hashIndex(formData.nik) },
      include: [{ model: User.scope('withPassword') }],
    })

    if (!getUser) throw new ErrorResponse.NotFound('Invalid credentials')

    const isPasswordMatch = await getUser.user.comparePassword(
      formData.password
    )

    if (!isPasswordMatch)
      throw new ErrorResponse.BadRequest('Invalid credentials')

    const data = await this.login({
      email: getUser.user.email,
      password: formData.password,
    })

    return data
  }

  async register(formData: RegisterDto): Promise<AuthResponseDto> {
    let data: any

    await db.sequelize!.transaction(async (transaction) => {
      const nikBlindIndex = Encryption.hashIndex(formData.nik)

      const duplicateNik = await UserDetail.scope('withNik').findOne({
        where: { nikHash: nikBlindIndex },
        transaction,
      })

      if (duplicateNik)
        throw new ErrorResponse.BaseResponse(
          'NIK already used',
          'Conflict',
          409
        )

      if (!formData.email) {
        formData.email = this.createEmailFromFullnameAndNik(
          formData.fullname,
          formData.nik
        )
      }

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

      if (formData.phoneNumber) {
        const duplicatePhoneNumber = await UserDetail.findOne({
          where: { phoneNumber: formData.phoneNumber },
          transaction,
        })

        if (duplicatePhoneNumber)
          throw new ErrorResponse.BaseResponse(
            'Phone number already used',
            'Conflict',
            409
          )
      }

      data = await User.create(
        { ...formData, RoleId: RoleId.user },
        { transaction }
      )

      await UserDetail.create(
        {
          ...formData,
          nikHash: formData.nik,
          nikEncrypted: formData.nik,
          UserId: data.id,
        },
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
