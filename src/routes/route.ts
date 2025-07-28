import express, { Router } from 'express'
import { v1Route } from './v1'

const Route: Router = express.Router()

Route.use('/v1', v1Route)

export default Route
