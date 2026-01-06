import * as yup from 'yup'

export const createQuestionnaireQuestionSchema = yup.object().shape({
  QuestionnaireId: yup.string().required('validation.required'),
  questionText: yup.string().required('validation.required'),
  questionType: yup.string().required('validation.required'),
  status: yup
    .string()
    .oneOf(['draft', 'publish'], 'validation.oneOf')
    .required('validation.required'),
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
    })
  )
  .required('validation.required')
