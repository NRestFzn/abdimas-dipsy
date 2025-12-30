import * as yup from 'yup'

export const updateUserSchema = yup.object().shape({
  fullname: yup.string().required('Fullname is required'),
  newPassword: yup
    .string()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .nullable()
    .min(8, 'New password min 8 characters'),

  confirmNewPassword: yup
    .string()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .nullable()
    .when('newPassword', {
      is: (val: string | null | undefined) =>
        val !== null && val !== undefined && val !== '',
      then: (schema) =>
        schema
          .required('Confirm new password is required when changing password')
          .oneOf([yup.ref('newPassword')], 'Passwords must match'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
})

export type UpdateUserSchema = yup.InferType<typeof updateUserSchema>
