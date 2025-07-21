import * as yup from 'yup'

const create = yup.object().shape({
  fullname: yup.string().required('Fullname is required'),
  birthDate: yup.date().required('Birth date is required'),
  birthCondition: yup.string().required('Birthdate is required'),
  gender: yup
    .string()
    .oneOf(['m', 'f'], 'Gender must be m or f')
    .required('Gender is required'),
  ParentId: yup.string().required('Parent id is required'),
})

const childSchema = {
  create,
}

module.exports = childSchema
