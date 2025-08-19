import express, { Router } from 'express'
import { RoleController } from './controller/role.controller'
import { AuthController } from './controller/auth.controller'
import { MarriageStatusController } from './controller/marriageStatus.controller'
import { EducationController } from './controller/education.controller'
import { RukunWargaController } from './controller/rukunWarga.controller'
import { RukunTetanggaController } from './controller/rukunTetangga.controller'
import { SalaryRangeController } from './controller/salaryRange.controller'

const Route: Router = express.Router()

Route.use('/role', RoleController)
Route.use('/auth', AuthController)
Route.use('/marriage-status', MarriageStatusController)
Route.use('/education', EducationController)
Route.use('/rukun-warga', RukunWargaController)
Route.use('/rukun-tetangga', RukunTetanggaController)
Route.use('/salary-range', SalaryRangeController)

export { Route as v1Route }
