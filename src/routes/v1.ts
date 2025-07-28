import express, { Router } from 'express'
import { AuthHandler } from '@/controllers/auth/controller'
import { RoleHandler } from '@/controllers/role/controller'

const Route: Router = express.Router()

Route.use('/auth', AuthHandler)
Route.use('/role', RoleHandler)

export { Route as v1Route }
