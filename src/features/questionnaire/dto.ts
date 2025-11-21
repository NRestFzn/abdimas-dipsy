import { QuestionnaireQuestionDto } from '../questionnaireQuestion/dto'

export interface QuestionnaireDto {
  id: string
  title: string
  description: string
  status: string
  riskThreshold: number
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
  riskThreshold: number
}

export interface UpdateQuestionnaireDto extends CreateQuestionnaireDto {}

export interface QuestionnaireQueryFilterDto extends CreateQuestionnaireDto {}
