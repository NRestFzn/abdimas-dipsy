import 'dotenv/config'
import { validate } from '@/lib/validate'

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_PORT: validate.number(process.env.APP_PORT) || 8000,
  APP_NAME: process.env.APP_NAME || 'Express Sequelize Typescript',
  APP_URL: process.env.APP_URL || 'http://localhost:8000',
  APP_DEFAULT_PASS: process.env.APP_DEFAULT_PASS || 'yourpassword',

  SEQUELIZE_CONNECTION: process.env.SEQUELIZE_CONNECTION || 'mysql',
  SEQUELIZE_HOST: process.env.SEQUELIZE_HOST || '127.0.0.1',
  SEQUELIZE_PORT: validate.number(process.env.SEQUELIZE_PORT) || 3306,
  SEQUELIZE_DATABASE: process.env.SEQUELIZE_DATABASE || 'example_db',
  SEQUELIZE_USERNAME: process.env.SEQUELIZE_USERNAME || 'root',
  SEQUELIZE_PASSWORD: process.env.SEQUELIZE_PASSWORD || '',
  SEQUELIZE_SYNC: validate.boolean(process.env.SEQUELIZE_SYNC) || false,
  SEQUELIZE_LOGGING: validate.boolean(process.env.SEQUELIZE_LOGGING) || true,
  SEQUELIZE_TIMEZONE: process.env.SEQUELIZE_TIMEZONE || 'Asia/Jakarta',

  JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '7d',
}
