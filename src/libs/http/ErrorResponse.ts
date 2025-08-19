class BaseResponse extends Error {
  public statusCode: number

  constructor(message: string, name = 'Internal Server', statusCode = 500) {
    super(message)
    this.message = message
    this.name = name
    this.statusCode = statusCode
    Object.setPrototypeOf(this, BaseResponse.prototype)
  }
}

class BadRequest extends BaseResponse {
  constructor(message: string) {
    super(message, 'Bad Request', 400)
    Object.setPrototypeOf(this, BadRequest.prototype)
  }
}

class Unauthorized extends BaseResponse {
  constructor(message: string) {
    super(message, 'Unauthorized', 401)
    Object.setPrototypeOf(this, Unauthorized.prototype)
  }
}

class Forbidden extends BaseResponse {
  constructor(message: string) {
    super(message, 'Forbidden', 403)
    Object.setPrototypeOf(this, Forbidden.prototype)
  }
}

class NotFound extends BaseResponse {
  constructor(message: string) {
    super(message, 'Not Found', 404)
    Object.setPrototypeOf(this, NotFound.prototype)
  }
}

class InternalServer extends BaseResponse {
  constructor(message: string) {
    super(message, 'Internal Server', 500)
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
