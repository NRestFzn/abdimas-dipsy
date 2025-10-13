import * as yup from 'yup'

export const createQuestionnaireQuestionSchema = yup.object().shape({
  QuestionnaireId: yup.string().required('QuestionnaireId is required'),
  questionText: yup.string().required('Question text is required'),
  questionType: yup.string().required('Question type is required'),
  status: yup
    .string()
    .oneOf(['draft', 'publish'], "Status must be one of 'draft' or 'publish'")
    .required('Status is required'),
})

export const updateQuestionnaireQuestionSchema = yup
  .array(
    yup.object().shape({
      id: yup.string().required('QuestionnaireId is required'),
      questionText: yup.string().required('Question text is required'),
      questionType: yup.string().required('Question type is required'),
      status: yup
        .string()
        .oneOf(
          ['draft', 'publish'],
          "Status must be one of 'draft' or 'publish'"
        )
        .required('Status is required'),
      order: yup.number().required('Order is required'),
    })
  )
  .required('Questionnaire Question Bulk Update form is required')
