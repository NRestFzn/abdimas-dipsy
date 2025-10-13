import { QuestionnaireDto } from '../questionnaire/dto'
import { UserDto } from '../user/dto'

export interface QuestionnaireSubmissionDto {
  id: string
  UserId: string
  QuestionnaireId: string
  createdAt: Date
  updatedAt: Date
}

export interface QuestionnaireSubmissionDetailDto
  extends QuestionnaireSubmissionDto {
  questionnaire: QuestionnaireDto
  user: UserDto
}

export interface CreateQuestionnaireSubmissionDto {
  UserId: string
  QuestionnaireId: string
  answers: [
    {
      QuestionId: string
      answerValue: string
    }
  ]
}
