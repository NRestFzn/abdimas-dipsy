import * as yup from 'yup'

export const marriageStatusSchema = yup.object().shape({
  name: yup.string().required('Marriage status name is required'),
})
