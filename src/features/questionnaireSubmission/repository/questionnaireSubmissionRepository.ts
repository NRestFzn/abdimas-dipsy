import { db } from '@/database/databaseConnection'
import { CreateQuestionnaireSubmissionDto } from '../dto'
import { QuestionnaireRepository } from '../../questionnaire/repository/questionnaireRepository'
import { QuestionnaireQuestionRepository } from '../../questionnaireQuestion/repository/questionnaireQuestionRepository'
import { ErrorResponse } from '@/libs/http/ErrorResponse'
import QuestionnaireSubmission from '@/database/model/questionnaireSubmission'
import QuestionnaireAnswer from '@/database/model/questionnaireAnswer'
import QuestionnaireQuestion from '@/database/model/questionnaireQuestion'

const questionnaireService = new QuestionnaireRepository()
const questionnaireQuestionService = new QuestionnaireQuestionRepository()

export class QuestionnaireSubmissionRepository {
  async add(formData: CreateQuestionnaireSubmissionDto): Promise<void> {
    const answerData: { QuestionId: string; answer: string }[] = []

    const questionnaire = await questionnaireService.getByIdPublic(
      formData.QuestionnaireId
    )

    if (!questionnaire)
      throw new ErrorResponse.NotFound('Questionnaire not found')

    if (formData.answers.length > 1) {
      for (let i = 0; i < formData.answers.length; i++) {
        const { QuestionId, answerValue } = formData.answers[i]

        const question = await QuestionnaireQuestion.findByPk(QuestionId)

        if (!question)
          throw new ErrorResponse.NotFound(
            `Question with id ${QuestionId} not found`
          )

        answerData.push({
          QuestionId: QuestionId,
          answer: answerValue,
        })
      }
    }
    if (formData.answers.length > questionnaire.questions.length) {
      throw new ErrorResponse.BadRequest(
        `Submitted answer is more than the available questions`
      )
    } else {
      throw new ErrorResponse.BadRequest(
        `Please answer all the available questions`
      )
    }

    await db.sequelize!.transaction(async (transaction) => {
      const bulkCreate = []
      const questionnaireSubmission = await QuestionnaireSubmission.create(
        {
          UserId: formData.UserId,
          QuestionnaireId: formData.QuestionnaireId,
        },
        { transaction }
      )

      for (let i = 0; i < answerData.length; i++) {
        bulkCreate.push({
          answerValue: answerData[i].answer,
          QuestionnaireQuestionId: answerData[i].QuestionId,
          QuestionnaireSubmissionId: questionnaireSubmission.id,
        })
      }

      await QuestionnaireAnswer.bulkCreate(bulkCreate, { transaction })
    })
  }
}
