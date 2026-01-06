import * as yup from 'yup'

export const educationSchema = yup.object().shape({
  name: yup.string().required('validation.required'),
})
