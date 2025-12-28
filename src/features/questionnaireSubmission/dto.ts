import { QuestionnaireDto } from '../questionnaire/dto'
import { UserDto } from '../user/dto'

export interface QuestionnaireSubmissionQueryFilterDto {
  UserId: string
  QuestionnaireId: string
}

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

export interface ISummarize {
  userCount: number
  submitCount: number
  stableMentalCount: number
  unStableMentalCount: number
  unStableMentalPercentage: number
}

export interface ISummarizePerRw extends ISummarize {
  rwId: string
  rwName: string
  rtCount: number
}

export interface ISummarizeByRwId extends ISummarize {
  rtId: string
  rtName: string
}

export interface IGetSummaryOptions {
  QuestionnaireId: string
  startDate?: Date
  endDate?: Date
}

export interface IGetSummaryOptionsByRw extends IGetSummaryOptions {
  RukunWargaId: string
}

export interface IGetSummaryOptionsByRt extends IGetSummaryOptionsByRw {
  RukunTetanggaId: string
}

export interface IGetSummaryOptionsByUser extends IGetSummaryOptionsByRt {
  UserId: string
}

export interface ISummarizeUserByRt {
  UserId: number
  fullname: string
  lastSubmissionDate: Date | null
  isMentalUnStable: boolean | null
}

export interface ISummarizeSubmissionByUser {
  submissionId: string
  submissionDate: Date
  isMentalUnStable: boolean
}

export interface ISummarizeByQuestionnaireIdDetailed {
  summarize: ISummarize
  perRw: (ISummarize & ISummarizePerRw)[]
}

export interface ISummarizeByRwIdDetailed {
  summarize: ISummarize
  perRt: (ISummarize & ISummarizeByRwId)[]
}

export interface ISummarizeByRtIdDetailed {
  summarize: ISummarize
  users: ISummarizeUserByRt[]
}

export interface ISummarizeByUserIdDetailed {
  UserId: string
  fullname: string
  summarize: Omit<ISummarize, 'userCount'>
  submissions: ISummarizeSubmissionByUser[]
}

interface IQuestionnaireAnswer {
  id: string
  QuestionnaireSubmissionId: string
  QuestionnaireQuestionId: string
  answerValue: string
}

export interface ISummarizeSubmission extends QuestionnaireSubmissionDetailDto {
  trueCount: number
  falseCount: number
  answeredCount: number
  isMentalUnstable: boolean
}
