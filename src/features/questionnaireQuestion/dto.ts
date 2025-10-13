export interface QuestionnaireQuestionDto {
  id: string
  questionText: string
  questionType: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateQuestionnaireQuestionDto {
  QuestionnaireId: string
  questionText: string
  questionType: string
  status: string
}

export interface UpdateQuestionnaireQuestionDto {
  id: string
  questionText: string
  questionType: string
  status: string
  order: number
}

export interface QuestionnaireQuestionQueryFilterDto
  extends CreateQuestionnaireQuestionDto {}
