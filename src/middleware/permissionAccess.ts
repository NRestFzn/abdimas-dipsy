import { green } from 'colorette'
import { NextFunction, Request, Response } from 'express'
import { logger } from '@/config/httplogger.config'
import asyncHandler from '@/helper/asyncHandler'
import User from '@/database/model/user'
import { UserLoginState } from '@/features/user/dto'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import Role from '../database/model/role'

export function permissionAccess(allowedRoles: string[]) {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const repo = {
        user: User,
      }

      const { uid: user_id } = req.getState('userLoginState') as UserLoginState

      const getUser = await repo.user.findOne({
        where: { id: user_id },
        include: [{ model: Role }],
      })

      if (!getUser) {
        throw new ErrorResponse.Unauthorized(req.t.errors.unauthorized)
      }

      const userRoleIds = getUser.roles
        ? getUser.roles.map((role) => role.id)
        : []

      const hasPermission = userRoleIds.some((id) => allowedRoles.includes(id))

      if (!hasPermission) {
        const msgType = green('permission')
        const errType = `permitted access error:`
        const errMessage = req.t.errors.unauthorized

        logger.error(`${msgType} - ${errType} ${errMessage}`)

        throw new ErrorResponse.Forbidden(errMessage)
      }

      next()
    }
  )
}

// export function notPermittedAccess(roleIds: string[]) {
//   return asyncHandler(
//     async (req: Request, res: Response, next: NextFunction) => {
//       const repo = {
//         user: User,
//       }

//       const { uid: user_id } = req.getState('userLoginState') as UserLoginState
//       const getUser = await repo.user.findOne({ where: { id: user_id } })

//       const errType = `not permitted access error:`
//       const errMessage = 'you are not allowed'

//       if (getUser && roleIds.includes(getUser.RoleId)) {
//         const msgType = green('permission')
//         logger.error(`${msgType} - ${errType} ${errMessage}`)

//         throw new ErrorResponse.Forbidden(`${errType} ${errMessage}`)
//       }

//       next()
//     }
//   )
// }
