import hpp from 'hpp'
import cors from 'cors'
import path from 'path'
import helmet from 'helmet'
import requestIp from 'request-ip'
import Route from '@/routes/index.route'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import userAgent from 'express-useragent'
import { httpLogger } from './httplogger.config'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import expressUserAgent from '@/middleware/expressUserAgent'
import expressRateLimit from '@/middleware/expressRateLimit'
import expressWithState from '@/middleware/expressWithState'
import expressErrorHandler from '@/middleware/expressErrorHandler'
import express, { Application, Request, Response } from 'express'
import expressErrorValidation from '@/middleware/expresYupHandler'
import expressErrorSequelize from '@/middleware/expressSequelizeHandler'
import { corsOptions } from '../libs/module/corsOption'
import expressCryptoError from '../middleware/cryptoErrorHandler'
import { langHandler } from '../middleware/langHandler'

export class App {
  private _app: Application

  constructor() {
    this._app = express()
    this._plugins()
    this._routes()
  }

  private _plugins() {
    this._app.set('trust proxy', 1)
    this._app.use(httpLogger)
    this._app.use(express.json({ limit: '20mb', type: 'application/json' }))
    this._app.use(express.urlencoded({ extended: true }))
    this._app.use(express.static(path.join(__dirname, '../../public')))
    this._app.use(compression())
    this._app.use(cookieParser())
    this._app.use(helmet())
    this._app.use(cors(corsOptions))
    this._app.use(hpp())
    this._app.use(requestIp.mw())
    this._app.use(userAgent.express())
    this._app.use(expressRateLimit())
    this._app.use(expressWithState())
    this._app.use(expressUserAgent())
    this._app.use(langHandler)
  }

  private _routes() {
    this._app.use(Route)

    // Catch error 404 endpoint not found
    this._app.all('/{*any}', (req: Request, _res: Response) => {
      const method = req.method
      const url = req.originalUrl
      const host = req.hostname

      const endpoint = `${host}${url}`

      throw new ErrorResponse.NotFound(
        `Sorry, the ${endpoint} HTTP method ${method} resource you are looking for was not found.`
      )
    })
  }

  public get create() {
    this._app.use(expressErrorValidation)

    this._app.use(expressErrorSequelize)

    this._app.use(expressCryptoError)

    this._app.use(expressErrorHandler)

    return this._app
  }
}
