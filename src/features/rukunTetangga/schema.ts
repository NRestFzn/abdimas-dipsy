import * as yup from 'yup'

export const rukunTetanggaSchema = yup.object().shape({
  name: yup.string().required('Rukun tetangga name is required'),
  RukunWargaId: yup.string().required('RukunWargaId is required'),
})
