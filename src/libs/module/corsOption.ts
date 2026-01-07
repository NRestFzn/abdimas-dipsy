import { CorsOptions } from 'cors'

export const allowedOrigins = [
  'http://localhost:5173',
  'https://abdimas-dipsy-fe.vercel.app',
  'https://dipsy.chevalierlabsas.org',
]

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-active-role'],
  optionsSuccessStatus: 200,
}
