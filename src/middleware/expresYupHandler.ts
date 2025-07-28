import { green } from 'colorette'
import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup'
import { logger } from '@/config/httplogger.config'

export default async function expressErrorValidation(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ValidationError) {
    const msgType = green('yup')
    const message = 'validation error!'

    logger.error(`${msgType} - ${message}`)

    const error = {
      code: 422,
      message,
      errors:
        err.inner.length > 0
          ? err.inner.reduce((acc: any, curVal: any) => {
              acc[`${curVal.path}`] = curVal.message || curVal.type
              return acc
            }, {})
          : { [`${err.path}`]: err.message || err.type },
    }

    return res.status(422).json(error)
  }

  next(err)
}
