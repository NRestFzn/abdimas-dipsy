import express, { Router } from 'express'
import { RoleController } from '@/routes/version1/controller/role.controller'

const Route: Router = express.Router()

Route.use('/role', RoleController)

export { Route as v1Route }
