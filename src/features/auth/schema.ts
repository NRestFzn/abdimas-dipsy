import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup
    .string()
    .email({ message: 'invalid email address' })
    .required("Email can't be empty"),
  password: yup
    .string()
    .min(8, 'Password min 8 characters')
    .required("Password can't be empty"),
})

export const loginWithNikSchema = yup.object({
  nik: yup.string().required("NIK or Email can't be empty"),
  password: yup
    .string()
    .min(8, 'Password min 8 characters')
    .required("Password can't be empty"),
})

export const registerSchema = yup.object({
  fullname: yup.string().required("Fullname can't be empty"),
  nik: yup
    .string()
    .required("NIK can't be empty")
    .min(16, 'NIK min 16 characters')
    .max(16, 'NIK max 16 caharcters'),
  email: yup
    .string()
    .email({ message: 'Invalid email address' })
    .optional()
    .nullable(),
  phoneNumber: yup.string().optional().nullable(),
  password: yup
    .string()
    .min(8, 'Password min 8 characters')
    .required("New password can't be empty"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required("Confirm password can't be empty"),
  gender: yup
    .string()
    .oneOf(['m', 'f'], "Gender must be one of 'm' or 'f'")
    .required("Gender can't be empty"),
  birthDate: yup.date().required("Birth date can't be empty"),
  profession: yup.string().required("Profession can't be empty"),
  RukunWargaId: yup.string().required("RukunWargaId can't be empty"),
  RukunTetanggaId: yup.string().required("RukunTetanggaId can't be empty"),
  MarriageStatusId: yup.string().required("MarriageStatusId can't be empty"),
  EducationId: yup.string().required("EducationId can't be empty"),
  SalaryRangeId: yup.string().required("SalaryRangeId can't be empty"),
})
