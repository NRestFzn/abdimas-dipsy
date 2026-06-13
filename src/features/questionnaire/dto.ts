import { QuestionnaireCategoryDto } from '../questionnaireCategory/dto'
import { QuestionnaireQuestionDto } from '../questionnaireQuestion/dto'
import {
  QuestionnaireScoringConfig,
  QuestionnaireScoringType,
} from './scoring'

export interface QuestionnaireDto {
  id: string
  title: string
  description: string
  status: string
  riskThreshold: number
  cooldownInMinutes: number
  CategoryId: string
  scoringType: QuestionnaireScoringType
  scoringConfig: QuestionnaireScoringConfig | null
  category: QuestionnaireCategoryDto
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
  cooldownInMinutes: number
  CategoryId: string
  scoringType: QuestionnaireScoringType
  scoringConfig: QuestionnaireScoringConfig | null
}

export interface UpdateQuestionnaireDto extends CreateQuestionnaireDto {}

export interface QuestionnaireQueryFilterDto extends CreateQuestionnaireDto {}
