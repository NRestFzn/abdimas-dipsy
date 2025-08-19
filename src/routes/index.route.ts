import express, { Router } from 'express'
import { v1Route } from './version1/version1.route'

const Route: Router = express.Router()

Route.use('/v1', v1Route)

export default Route
