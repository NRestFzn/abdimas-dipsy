import express, { Router } from 'express'
import { RoleController } from './version1/controller/role.controller'
import { AuthController } from './version1/controller/auth.controller'
import { MarriageStatusController } from './version1/controller/marriageStatus.controller'
import { EducationController } from './version1/controller/education.controller'
import { RukunWargaController } from './version1/controller/rukunWarga.controller'
import { RukunTetanggaController } from './version1/controller/rukunTetangga.controller'
import { SalaryRangeController } from './version1/controller/salaryRange.controller'
import { QuestionnaireController } from './version1/controller/questionnaire.controller'
import { QuestionnaireQuestionController } from './version1/controller/questionnaireQuestion.controller'
import { QuestionnaireSubmissionController } from './version1/controller/questionnaireSubmission.controller'
import { ResidentController } from './version1/controller/resident.controller'
import { UserController } from './version1/controller/user.controller'
import { QuestionnaireCategoryController } from './version1/controller/questionnaireCategory.controller'

const Route: Router = express.Router()

Route.use('/role', RoleController)
Route.use('/auth', AuthController)
Route.use('/marriage-status', MarriageStatusController)
Route.use('/education', EducationController)
Route.use('/rukun-warga', RukunWargaController)
Route.use('/rukun-tetangga', RukunTetanggaController)
Route.use('/salary-range', SalaryRangeController)
Route.use('/questionnaire', QuestionnaireController)
Route.use('/questionnaire-question', QuestionnaireQuestionController)
Route.use('/questionnaire-submission', QuestionnaireSubmissionController)
Route.use('/resident', ResidentController)
Route.use('/user', UserController)
Route.use('/questionnaire-category', QuestionnaireCategoryController)

export { Route as v1Route }
