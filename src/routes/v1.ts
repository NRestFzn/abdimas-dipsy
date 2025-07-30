import express, { Router } from 'express'
import { AuthHandler } from '@/controllers/auth/controller'
import { RoleHandler } from '@/controllers/role/controller'
import { CategoryHandler } from '@/controllers/category/controller'
import { ArticleHandler } from '@/controllers/article/controller'
import { ThreadHandler } from '@/controllers/thread/controller'
import { ThreadCommentHandler } from '@/controllers/threadcomment/controller'
import { CalculatorHandler } from '@/controllers/calculator/controller'

const Route: Router = express.Router()

Route.use('/auth', AuthHandler)
Route.use('/role', RoleHandler)
Route.use('/category', CategoryHandler)
Route.use('/article', ArticleHandler)
Route.use('/thread', ThreadHandler)
Route.use('/thread-comment', ThreadCommentHandler)
Route.use('/calc', CalculatorHandler)

export { Route as v1Route }
