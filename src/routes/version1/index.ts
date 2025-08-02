import express, { Router } from 'express'
import { RoleController } from './controller/role.controller'
import { AuthController } from './controller/auth.controller'

const Route: Router = express.Router()

Route.use('/role', RoleController)
Route.use('/auth', AuthController)

export { Route as v1Route }
