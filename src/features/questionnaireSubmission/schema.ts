import * as yup from 'yup'

export const createQuestionnaireSubmissionSchema = yup.object().shape({
  QuestionnaireId: yup.string().required('QuestionnaireId is required'),
  UserId: yup.string().required('UserId is required'),
  answers: yup
    .array(
      yup.object().shape({
        QuestionId: yup.string().required('QuestionId is required'),
        answerValue: yup.string().required('Answer is required'),
      })
    )
    .required('Answers is required'),
})
