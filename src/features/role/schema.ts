import * as yup from 'yup'

export const roleSchema = yup.object().shape({
  name: yup.string().required('validation.required'),
})

export const roleQuerySchema = yup.object().shape({
  id: yup.string().required('validation.required'),
})

export type RoleQuery = yup.InferType<typeof roleQuerySchema>
