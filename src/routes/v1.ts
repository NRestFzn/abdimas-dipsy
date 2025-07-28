import express, { Router } from 'express'
import { AuthHandler } from '@/controllers/auth/controller'

const Route: Router = express.Router()

Route.use('/auth', AuthHandler)

export { Route as v1Route }
