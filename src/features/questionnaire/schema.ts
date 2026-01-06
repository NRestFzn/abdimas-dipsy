import * as yup from 'yup'

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
})

export const updateQuestionnaireSchema = createQuestionnaireSchema.clone()
