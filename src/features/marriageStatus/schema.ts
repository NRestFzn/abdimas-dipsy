import * as yup from 'yup'

export const marriageStatusSchema = yup.object().shape({
  name: yup.string().required('validation.required'),
})
