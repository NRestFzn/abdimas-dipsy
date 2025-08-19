import * as yup from 'yup'

export const salaryRangeSchema = yup.object().shape({
  minRange: yup.number().required('Min range is required'),
  maxRange: yup.number().required('max range is required'),
})
