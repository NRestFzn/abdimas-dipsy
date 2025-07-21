import * as yup from 'yup'

const create = yup.object().shape({
  status: yup.string().required('Satus is required'),
  vaccineName: yup.string().required('Vaccine name is required'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required'),
  ChildId: yup.string().required('ChildId is required'),
})

const immunizationScheduleSchema = {
  create,
}

module.exports = immunizationScheduleSchema
