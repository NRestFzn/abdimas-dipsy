import * as yup from 'yup'

export const createQuestionnaireSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  status: yup
    .string()
    .oneOf(['draft', 'publish'], "Status must be one of 'draft' or 'publish'")
    .required('Status is required'),
  riskThreshold: yup.number().required('Risk threshold is required'),
  cooldownInMinutes: yup.number().required('Cooldown in minutes is required'),
})

export const updateQuestionnaireSchema = createQuestionnaireSchema.clone()
