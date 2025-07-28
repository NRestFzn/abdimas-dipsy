import 'reflect-metadata'

import { Sequelize, type SequelizeOptions } from 'sequelize-typescript'
import { env } from '@/config/env.config'
import { logger } from '@/config/httplogger.config'

type ConnectionType = 'mysql'

const sequelizeOptions: SequelizeOptions = {
  dialect: env.SEQUELIZE_CONNECTION as ConnectionType,
  host: env.SEQUELIZE_HOST,
  port: env.SEQUELIZE_PORT,
  username: env.SEQUELIZE_USERNAME,
  password: env.SEQUELIZE_PASSWORD,
  database: env.SEQUELIZE_DATABASE,
  logQueryParameters: env.SEQUELIZE_LOGGING,
  timezone: env.SEQUELIZE_TIMEZONE,
  models: [`${__dirname}/model`],
}

const sequelize = new Sequelize({ ...sequelizeOptions })
export const db = { sequelize }

export const initDatabase = async () => {
  try {
    await sequelize.authenticate()
    logger.info(
      `Database connection established: ${sequelize.options.database}`
    )

    if (env.SEQUELIZE_SYNC) {
      await sequelize.sync({ force: true })
      logger.info(`Sync database successfully`)
    }
  } catch (error: any) {
    logger.error(`Failed to initialize database: ${error.message}`)
    process.exit(1)
  }
}
