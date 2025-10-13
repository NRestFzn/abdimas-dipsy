import { QuestionnaireSubmissionRepository } from '@/features/questionnaireSubmission/repository/questionnaireSubmissionRepository'
import { permissionAccess } from '@/middleware/permissionAccess'
import authorization from '@/middleware/authorization'
import express, { Response, Request } from 'express'
import HttpResponse from '@/libs/http/HttpResponse'
import { createQuestionnaireSubmissionSchema } from '@/features/questionnaireSubmission/schema'
import asyncHandler from '@/helper/asyncHandler'
import { RoleId } from '@/libs/constant/roleIds'
import _ from 'lodash'
import { CreateQuestionnaireSubmissionDto } from '@/features/questionnaireSubmission/dto'

const repository = new QuestionnaireSubmissionRepository()

const route = express.Router()

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

    res.json({ newFormData })
  })
)

export { route as QuestionnaireSubmissionController }
