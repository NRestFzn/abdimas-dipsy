import * as yup from 'yup'

export const createRukunTetanggaSchema = yup.object().shape({
  count: yup
    .number()
    .positive('Count must a positive number')
    .moreThan(0, 'Count must more than 0')
    .required('Count is required'),
  RukunWargaId: yup.string().required('RukunWargaId is required'),
})

export const updateRukunTetanggaSchema = yup.object().shape({
  name: yup
    .number()
    .positive('Name must a positive number')
    .moreThan(0, 'Name must more than 0')
    .required('Rukun warga name is required'),
})
