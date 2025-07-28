import * as yup from 'yup'

export const roleSchema = yup.object().shape({
  name: yup.string().required('Role name is required'),
})

export type CreateRoleSchema = yup.InferType<typeof roleSchema>
export type UpdateRoleSchema = yup.InferType<typeof roleSchema>

export type RoleType = yup.InferType<typeof roleSchema> & {
  id: string
}
