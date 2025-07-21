import * as yup from 'yup'

const create = yup.object().shape({
  title: yup.string().required('Title is required'),
  reachedDate: yup.date().required('reachedDate'),
  status: yup.string().required('Status is required'),
  description: yup.string().required('Description is required'),
  ChildId: yup.string().required('ChildId is required'),
})

const growMilestonesSchema = {
  create,
}

module.exports = growMilestonesSchema
