export interface QuestionnaireCategoryDto {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateQuestionnaireCategoryDto {
  name: string
}

export interface UpdateQuestionnaireCategoryDto {
  name: string
}

export interface QuestionnaireCategoryQueryFilterDto {
  name: string
}
