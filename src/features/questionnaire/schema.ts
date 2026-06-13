import * as yup from 'yup'
import {
  QuestionnaireScoringConfig,
  questionnaireScoringTypes,
} from './scoring'

export const createQuestionnaireSchema = yup.object().shape({
  title: yup.string().required('validation.required'),
  description: yup.string().required('validation.required'),
  status: yup
    .string()
    .oneOf(['draft', 'publish'], 'validation.oneOf')
    .required('validation.required'),
  riskThreshold: yup.number().required('validation.required'),
  cooldownInMinutes: yup.number().required('validation.required'),
  CategoryId: yup.string().required('validation.required'),
  scoringType: yup
    .string()
    .oneOf([...questionnaireScoringTypes], 'validation.oneOf')
    .default('binary_threshold')
    .required('validation.required'),
  scoringConfig: yup.mixed<QuestionnaireScoringConfig>().nullable().default(null),
})

export const updateQuestionnaireSchema = createQuestionnaireSchema.clone()

export const questionnaireQuerySchema = yup.object().shape({
  id: yup.string().required('validation.required'),
})

export type QuestionnaireQuery = yup.InferType<typeof questionnaireQuerySchema>
