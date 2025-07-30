import express, { Router } from 'express'
import { AuthHandler } from '@/controllers/auth/controller'
import { RoleHandler } from '@/controllers/role/controller'
import { CategoryHandler } from '@/controllers/category/controller'

const Route: Router = express.Router()

Route.use('/auth', AuthHandler)
Route.use('/role', RoleHandler)
Route.use('/category', CategoryHandler)

export { Route as v1Route }
