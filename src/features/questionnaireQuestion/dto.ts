import { QuestionScoreOverrides } from '../questionnaire/scoring'

export interface QuestionnaireQuestionDto {
  id: string
  questionText: string
  questionType: string
  order: number
  scoringCategory: string | null
  scoreOverrides: QuestionScoreOverrides | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateQuestionnaireQuestionDto {
  QuestionnaireId: string
  questionText: string
  questionType: string
  status: string
  scoringCategory: string | null
  scoreOverrides: QuestionScoreOverrides | null
}

export interface UpdateQuestionnaireQuestionDto {
  id: string
  questionText: string
  questionType: string
  status: string
  order: number
  scoringCategory: string | null
  scoreOverrides: QuestionScoreOverrides | null
}

export interface QuestionnaireQuestionQueryFilterDto
  extends CreateQuestionnaireQuestionDto {}
