import * as yup from 'yup'

// Schema
export const createPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, 'new password at least 8 characters')
    .required("Password can't be empty"),
  confirmNewPassword: yup
    .string()
    .min(8, 'confirm new password at least 8 characters')
    .required("Confirm password can't be empty")
    .oneOf(
      [yup.ref('newPassword')],
      "New password and Confirm new password don't match"
    ),
})

export const userSchema = createPasswordSchema.concat(
  yup.object({
    fullname: yup.string().required("Fullname can't be empty"),
    email: yup.string().required("Email can't be empty"),
    RoleId: yup.string().required("RoleId can't be empty"),
  })
)

export type CreatePasswordSchema = yup.InferType<typeof createPasswordSchema>
export type UserLoginState = {
  uid: string
}
