import * as yup from 'yup'

const dailyNutritionSchema = yup.object().shape({
  weight: yup.number().required('Weight is required'),
  height: yup.number().required('Height is required'),
  age: yup
    .number()
    .positive('Age must a positive number')
    .required('Height is required'),
  ageUnit: yup.string().oneOf(['month', 'year']).required(),
  gender: yup.string().oneOf(['F', 'M']).required('Gender is required'),
  activityLevel: yup
    .string()
    .oneOf(['sedentary', 'light', 'moderate', 'heavy'])
    .required('Activity level is required'),
})

const childGrowSchema = yup.object().shape({
  weight: yup.number().positive().required('Berat badan harus diisi'),
  height: yup.number().positive().required('Tinggi badan harus diisi'),
  age: yup.number().positive('Umur harus positif').required('Umur harus diisi'),
  ageUnit: yup
    .string()
    .oneOf(['month', 'year'])
    .required('Satuan umur harus diisi'),
  gender: yup
    .string()
    // .oneOf(['F', 'M'])
    .required('Gender harus diisi'),
})

const calcSchema = {
  childGrowSchema,
  dailyNutritionSchema,
}

module.exports = calcSchema
