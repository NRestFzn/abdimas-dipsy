import * as yup from 'yup'

export const salaryRangeSchema = yup.object().shape({
  minRange: yup.number().required('validation.required'),
  maxRange: yup.number().required('validation.required'),
})
