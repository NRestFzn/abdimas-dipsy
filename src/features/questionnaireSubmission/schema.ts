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

export const submissionParams = yup.object().shape({
  id: yup.string().required('Id is required'),
})

export const summarizeByQuestionnaireIdParams = yup.object().shape({
  QuestionnaireId: yup.string().required('QuestionnaireId is required'),
})

export const summarizeByQuestionnaireIdQuery = yup.object().shape({
  startDate: yup.date().optional(),
  endDate: yup.date().optional(),
})

export const summarizeByRwIdQuery = summarizeByQuestionnaireIdQuery.shape({
  RukunWargaId: yup.string().required(),
})

export const summarizeByRtIdQuery = summarizeByRwIdQuery.shape({
  RukunTetanggaId: yup.string().required(),
})

export const summarizeByUserIdQuery = summarizeByRtIdQuery.shape({
  UserId: yup.string().required(),
})

export type SubmissionParams = yup.InferType<typeof submissionParams>

export type SummarizeByQuestionnaireIdQuery = yup.InferType<
  typeof summarizeByQuestionnaireIdQuery
>

export type SummarizeByQuestionnaireIdParams = yup.InferType<
  typeof summarizeByQuestionnaireIdParams
>

export type SummarizeByRwIdQuery = yup.InferType<typeof summarizeByRwIdQuery>

export type SummarizeByRtIdQuery = yup.InferType<typeof summarizeByRtIdQuery>

export type SummarizeByUserIdQuery = yup.InferType<
  typeof summarizeByUserIdQuery
>
