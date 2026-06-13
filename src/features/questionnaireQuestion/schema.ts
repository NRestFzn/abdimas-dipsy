import * as yup from 'yup'
import { QuestionScoreOverrides } from '../questionnaire/scoring'

export const createQuestionnaireQuestionSchema = yup.object().shape({
  QuestionnaireId: yup.string().required('validation.required'),
  questionText: yup.string().required('validation.required'),
  questionType: yup.string().required('validation.required'),
  status: yup
    .string()
    .oneOf(['draft', 'publish'], 'validation.oneOf')
    .required('validation.required'),
  scoringCategory: yup.string().nullable().default(null),
  scoreOverrides: yup.mixed<QuestionScoreOverrides>().nullable().default(null),
})

export const updateQuestionnaireQuestionSchema = yup
  .array(
    yup.object().shape({
      id: yup.string().required('validation.required'),
      questionText: yup.string().required('validation.required'),
      questionType: yup.string().required('validation.required'),
      status: yup
        .string()
        .oneOf(['draft', 'publish'], 'validation.oneOf')
        .required('validation.required'),
      order: yup.number().required('validation.required'),
      scoringCategory: yup.string().nullable().default(null),
      scoreOverrides: yup.mixed<QuestionScoreOverrides>().nullable().default(null),
    })
  )
  .required('validation.required')

export const questionnaireQuestionQuerySchema = yup.object().shape({
  id: yup.string().required('validation.required'),
})

export type QuestionnaireQuestionQuery = yup.InferType<
  typeof questionnaireQuestionQuerySchema
>
