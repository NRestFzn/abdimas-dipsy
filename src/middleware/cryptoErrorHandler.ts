import { red } from 'colorette'
import { NextFunction, Request, Response } from 'express'
import { logger } from '@/config/httplogger.config'
import { env } from '../config/env.config'

export default async function expressCryptoError(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const isCryptoError =
    err.message?.includes('Invalid initialization vector') ||
    err.code?.includes('ERR_OSSL') ||
    err.code?.includes('ERR_CRYPTO')

  if (isCryptoError) {
    const msgType = red('crypto')
    const message = 'Decryption failed. Data might be corrupted or invalid.'

    logger.error(`${msgType} - ${err.message}`)

    const error = {
      code: 400,
      message,
      detail: env.NODE_ENV === 'development' ? err.message : undefined,
    }

    return res.status(400).json(error)
  }

  next(err)
}
