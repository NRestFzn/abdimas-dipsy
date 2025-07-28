import http from 'http'
import { initDatabase } from '@/database/databaseConnection'
import { App } from './config/app.config'
import { env } from './config/env.config'
import { httpHandle } from './lib/http/handle'

function bootstrap() {
  const port = env.APP_PORT
  const app = new App().create
  const server = http.createServer(app)

  // initial database
  initDatabase()

  // http handle
  const { onError, onListening } = httpHandle(server, port)

  // run server listen
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)
}

bootstrap()
