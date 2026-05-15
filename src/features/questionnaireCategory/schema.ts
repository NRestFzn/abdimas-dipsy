import * as yup from 'yup'

export const questionnaireCategorySchema = yup.object().shape({
  name: yup.string().required('validation.required'),
})

export const questionnaireCategoryQuerySchema = yup.object().shape({
  id: yup.string().required('validation.required'),
})

export type QuestionnaireCategoryQuery = yup.InferType<
  typeof questionnaireCategoryQuerySchema
>
