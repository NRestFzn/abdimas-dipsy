import * as yup from 'yup'

export const questionnaireCategorySchema = yup.object().shape({
  name: yup.string().required('validation.required'),
})
