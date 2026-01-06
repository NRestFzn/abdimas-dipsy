import { green } from 'colorette'
import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup'
import { logger } from '@/config/httplogger.config'

const formatMessage = (
  template: string,
  fieldName: string,
  attributes: any
) => {
  const humanFieldName = attributes[fieldName] || fieldName

  return template.replace('{field}', humanFieldName)
}

const getObjectValue = (obj: any, path: string) => {
  if (!obj || !path) return undefined

  return path
    .split('.')
    .reduce((acc, part) => (acc && acc[part] ? acc[part] : null), obj)
}

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
      message: 'Validation Error',
      errors:
        err.inner.length > 0
          ? err.inner.reduce((acc: any, curVal: any) => {
              const key = curVal.message
              const template = getObjectValue(_req.t, key) || key

              const fieldPath = curVal.path || 'field'

              const finalMessage = formatMessage(
                template,
                fieldPath,
                _req.t.attributes
              )

              acc[fieldPath] = finalMessage
              return acc
            }, {})
          : {
              // Handle single error
              [`${err.path}`]: formatMessage(
                getObjectValue(_req.t, err.message) || err.message,
                err.path || 'field',
                _req.t.attributes
              ),
            },
    }
    return res.status(422).json(error)
  }

  next(err)
}
