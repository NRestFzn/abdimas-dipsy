import * as yup from 'yup'

export const threadSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  status: yup
    .string()
    .oneOf(['draft', 'publish'], "status must be one of 'draft' or 'publish'")
    .required('Status is required'),
  AuthorId: yup.string().required('AuthorId is required'),
})

export type CreateThreadSchema = yup.InferType<typeof threadSchema>
export type UpdateThreadSchema = yup.InferType<typeof threadSchema>

export type ThreadType = yup.InferType<typeof threadSchema> & {
  id: string
}
