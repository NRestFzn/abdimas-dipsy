import { QuestionnaireQuestionDto } from '../questionnaireQuestion/dto'

export interface QuestionnaireDto {
  id: string
  title: string
  description: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface QuestionnaireDetailDto extends QuestionnaireDto {
  questions: QuestionnaireQuestionDto[]
}

export interface CreateQuestionnaireDto {
  title: string
  description: string
  status: string
}

export interface UpdateQuestionnaireDto extends CreateQuestionnaireDto {}

export interface QuestionnaireQueryFilterDto extends CreateQuestionnaireDto {}
