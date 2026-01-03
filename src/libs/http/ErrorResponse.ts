class BaseResponse extends Error {
  public statusCode: number
  args?: Record<string, string | number>

  constructor(
    message: string,
    name = 'Internal Server',
    statusCode = 500,
    args?: Record<string, string | number>
  ) {
    super(message)
    this.message = message
    this.name = name
    this.statusCode = statusCode
    this.args = args
    Object.setPrototypeOf(this, BaseResponse.prototype)
  }
}

class BadRequest extends BaseResponse {
  constructor(message: string, args?: Record<string, string | number>) {
    super(message, 'Bad Request', 400, args)
    Object.setPrototypeOf(this, BadRequest.prototype)
  }
}

class Unauthorized extends BaseResponse {
  constructor(message: string, args?: Record<string, string | number>) {
    super(message, 'Unauthorized', 401, args)
    Object.setPrototypeOf(this, Unauthorized.prototype)
  }
}

class Forbidden extends BaseResponse {
  constructor(message: string, args?: Record<string, string | number>) {
    super(message, 'Forbidden', 403, args)
    Object.setPrototypeOf(this, Forbidden.prototype)
  }
}

class NotFound extends BaseResponse {
  constructor(message: string, args?: Record<string, string | number>) {
    super(message, 'Not Found', 404, args)
    Object.setPrototypeOf(this, NotFound.prototype)
  }
}

export class InternalServer extends BaseResponse {
  constructor(message: string, args?: Record<string, string | number>) {
    super(message, 'Internal Server', 500, args)
    Object.setPrototypeOf(this, InternalServer.prototype)
  }
}

export const ErrorResponse = {
  BaseResponse,
  BadRequest,
  Forbidden,
  InternalServer,
  NotFound,
  Unauthorized,
}
