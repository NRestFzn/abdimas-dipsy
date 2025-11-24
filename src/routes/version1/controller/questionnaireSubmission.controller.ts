import { QuestionnaireSubmissionRepository } from '@/features/questionnaireSubmission/repository/questionnaireSubmissionRepository'
import { permissionAccess } from '@/middleware/permissionAccess'
import authorization from '@/middleware/authorization'
import express, { Response, Request } from 'express'
import HttpResponse from '@/libs/http/HttpResponse'
import {
  createQuestionnaireSubmissionSchema,
  submissionParams,
  SubmissionParams,
  SummarizeByQuestionnaireIdParams,
  SummarizeByQuestionnaireIdQuery,
  summarizeByRtIdQuery,
  SummarizeByRtIdQuery,
  summarizeByRwIdQuery,
  SummarizeByRwIdQuery,
  summarizeByUserIdQuery,
  SummarizeByUserIdQuery,
} from '@/features/questionnaireSubmission/schema'
import asyncHandler from '@/helper/asyncHandler'
import { RoleId } from '@/libs/constant/roleIds'
import _ from 'lodash'
import {
  CreateQuestionnaireSubmissionDto,
  IGetSummaryOptions,
  IGetSummaryOptionsByRt,
  IGetSummaryOptionsByRw,
  IGetSummaryOptionsByUser,
} from '@/features/questionnaireSubmission/dto'
import User from '@/database/model/user'
import UserDetail from '@/database/model/userDetail'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import { UserLoginState } from '@/features/user/dto'

const repository = new QuestionnaireSubmissionRepository()

const route = express.Router()

route.get(
  '/history-me',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const user: UserLoginState = req.getState('userLoginState')

    const data = await repository.getAllSummarizeByLoggedInUser(user.uid)

    const httpResponse = HttpResponse.get({
      message: 'Data retrieved successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/summary/:QuestionnaireId',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const params: SummarizeByQuestionnaireIdParams = req.getParams()

    const query: SummarizeByQuestionnaireIdQuery = req.query

    const options: IGetSummaryOptions = {
      QuestionnaireId: params.QuestionnaireId,
      ...query,
    }

    const data = await repository.summarizeByQuestionnaireId(options)

    const httpResponse = HttpResponse.get({
      message: 'Data retrieved successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/summary-rw/:QuestionnaireId',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const params: SummarizeByQuestionnaireIdParams = req.getParams()

    const query: SummarizeByRwIdQuery = summarizeByRwIdQuery.validateSync(
      req.query
    )

    const options: IGetSummaryOptionsByRw = {
      QuestionnaireId: params.QuestionnaireId,
      ...query,
    }

    const data = await repository.summarizeByRwId(options)

    const httpResponse = HttpResponse.get({
      message: 'Data retrieved successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/summary-rt/:QuestionnaireId',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const params: SummarizeByQuestionnaireIdParams = req.getParams()

    const query: SummarizeByRtIdQuery = summarizeByRtIdQuery.validateSync(
      req.query
    )

    const options: IGetSummaryOptionsByRt = {
      QuestionnaireId: params.QuestionnaireId,
      ...query,
    }

    const data = await repository.summarizeByRtId(options)

    const httpResponse = HttpResponse.get({
      message: 'Data retrieved successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/summary-user/:QuestionnaireId',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const params: SummarizeByQuestionnaireIdParams = req.getParams()

    const query: SummarizeByUserIdQuery = summarizeByUserIdQuery.validateSync(
      req.query
    )

    const options: IGetSummaryOptionsByUser = {
      QuestionnaireId: params.QuestionnaireId,
      ...query,
    }

    const data = await repository.summarizeByUserId(options)

    const httpResponse = HttpResponse.get({
      message: 'Data retrieved successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/summary-me/:QuestionnaireId',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const params: SummarizeByQuestionnaireIdParams = req.getParams()

    const user = await User.findByPk(req.getState('userLoginState').uid, {
      include: [{ model: UserDetail }],
    })

    if (!user) {
      throw new ErrorResponse.NotFound('User not found')
    }

    if (!user.userDetail) {
      throw new ErrorResponse.BadRequest('User has not filled complete data')
    }

    const query: SummarizeByUserIdQuery = summarizeByUserIdQuery.validateSync({
      ...req.query,
      UserId: user.id,
      RukunTetanggaId: user.userDetail.RukunTetanggaId,
      RukunWargaId: user.userDetail.RukunWargaId,
    })

    const options: IGetSummaryOptionsByUser = {
      QuestionnaireId: params.QuestionnaireId,
      ...query,
    }

    const data = await repository.summarizeByUserId(options)

    const httpResponse = HttpResponse.get({
      message: 'Data retrieved successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.get(
  '/:id/detail',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const params: SubmissionParams = submissionParams.validateSync(req.params)

    const data = await repository.submissionDetail(params.id)

    const httpResponse = HttpResponse.created({
      message: 'Data created successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

route.post(
  '/:questionnaireId/submit',
  authorization(),
  asyncHandler(async (req: Request, res: Response) => {
    const formData = req.getBody()

    const user = req.getState('userLoginState')

    const params = req.getParams()

    const newFormData: CreateQuestionnaireSubmissionDto = {
      UserId: user.uid,
      QuestionnaireId: params.questionnaireId,
      answers: formData.answers,
    }

    const values = createQuestionnaireSubmissionSchema.validateSync(newFormData)

    const data = await repository.add(newFormData)

    const httpResponse = HttpResponse.created({
      message: 'Data created successfully',
      data,
    })

    res.status(httpResponse.statusCode).json(httpResponse)
  })
)

export { route as QuestionnaireSubmissionController }
