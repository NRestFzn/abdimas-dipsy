import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import multer from 'multer'
import { ErrorResponse } from '@/libs/http/ErrorResponse'

interface DtoErrorResponse {
  statusCode: number
  error: string
  message: string
}

const formatMessage = (
  template: string,
  args?: Record<string, string | number>
) => {
  if (!args) return template
  return Object.keys(args).reduce((msg, key) => {
    return msg.replace(`{${key}}`, String(args[key]))
  }, template)
}

function generateErrorResponse(
  err: any,
  statusCode: number,
  t: any
): DtoErrorResponse {
  const template = _.get(t, err.message) || err.message

  const message =
    typeof template === 'string' ? formatMessage(template, err.args) : template

  return _.isObject(err.message)
    ? err.message
    : { statusCode, error: err.name, message }
}

export default async function expressErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json(generateErrorResponse(err, 400, req.t))
  }

  if (err instanceof ErrorResponse.BaseResponse) {
    return res
      .status(err.statusCode)
      .json(generateErrorResponse(err, err.statusCode, req.t))
  }

  next(err)
}
