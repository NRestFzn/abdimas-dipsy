import * as yup from 'yup'

export const threadCommentSchema = yup.object().shape({
  message: yup.string().required('Message is required'),
  ThreadId: yup.string().required('ThreadId is required'),
  UserId: yup.string().required('UserId is required'),
})

export type CreateThreadCommentSchema = yup.InferType<
  typeof threadCommentSchema
>
export type UpdateThreadCommentSchema = yup.InferType<
  typeof threadCommentSchema
>

export type ThreadCommentType = yup.InferType<typeof threadCommentSchema> & {
  id: string
}
