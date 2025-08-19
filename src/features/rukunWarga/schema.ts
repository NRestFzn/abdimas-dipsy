import * as yup from 'yup'

export const rukunWargaSchema = yup.object().shape({
  name: yup.string().required('Rukun warga name is required'),
})
