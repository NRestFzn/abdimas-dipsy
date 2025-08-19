import * as yup from 'yup'

export const rukunTetanggaSchema = yup.object().shape({
  name: yup.number().required('Rukun tetangga name is required'),
  RukunWargaId: yup.string().required('RukunWargaId is required'),
})
