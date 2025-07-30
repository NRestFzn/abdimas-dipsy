import * as yup from 'yup'

export const categorySchema = yup.object().shape({
  name: yup.string().required('Category name is required'),
})

export type CreateCategorySchema = yup.InferType<typeof categorySchema>
export type UpdateCategorySchema = yup.InferType<typeof categorySchema>

export type CategoryType = yup.InferType<typeof categorySchema> & {
  id: string
}
