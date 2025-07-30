import express, { Router } from 'express'
import { AuthHandler } from '@/controllers/auth/controller'
import { RoleHandler } from '@/controllers/role/controller'
import { CategoryHandler } from '@/controllers/category/controller'
import { ArticleHandler } from '@/controllers/article/controller'

const Route: Router = express.Router()

Route.use('/auth', AuthHandler)
Route.use('/role', RoleHandler)
Route.use('/category', CategoryHandler)
Route.use('/article', ArticleHandler)

export { Route as v1Route }
