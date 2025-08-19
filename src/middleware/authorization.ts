import { Request, Response, NextFunction } from 'express'
import { env } from '@/config/env.config'
import asyncHandler from '@/helper/asyncHandler'
import JwtToken from '@/libs/jwtToken'
import _ from 'lodash'

const jwt = new JwtToken({ secret: env.JWT_SECRET, expires: env.JWT_EXPIRES })

export default function authorization() {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const token = jwt.extract(req)
      if (!token) {
        res.status(401).json({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Unauthorized, cannot extract token from request',
        })
        return
      }

      const decoded = jwt.verify(token)
      if (!decoded.data) {
        res.status(401).json({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Unauthorized, invalid jwt',
        })
        return
      }

      req.setState({ userLoginState: decoded.data })
      next()
    }
  )
}
