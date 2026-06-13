import { ErrorResponse } from '@/libs/http/ErrorResponse'

export const questionnaireScoringTypes = [
  'binary_threshold',
  'weighted_score',
] as const

export type QuestionnaireScoringType =
  (typeof questionnaireScoringTypes)[number]

export interface ScoringAnswerOption {
  value: string
  label: string
  score: number
}

export interface ScoringResultRange {
  key: string
  label: string
  minScore: number
  maxScore: number
  isRisk: boolean
  recommendation?: string
}

export interface ScoringCategory {
  key: string
  label: string
  includeInTotal: boolean
  ranges: ScoringResultRange[]
}

export interface QuestionnaireScoringConfig {
  answerOptions: ScoringAnswerOption[]
  categories: ScoringCategory[]
  total: {
    label: string
    ranges: ScoringResultRange[]
  }
}

export type QuestionScoreOverrides = Record<string, number>

export interface ScorableQuestion {
  id: string
  scoringCategory?: string | null
  scoreOverrides?: QuestionScoreOverrides | null
}

export interface ScoringAnswerInput {
  QuestionId: string
  answerValue: string
}

export interface EvaluatedAnswer {
  QuestionId: string
  answerValue: string
  answerLabel: string
  score: number
  scoringCategory: string | null
}

export interface EvaluatedOutcome extends ScoringResultRange {}

export interface EvaluatedCategory {
  key: string
  label: string
  includeInTotal: boolean
  score: number
  outcome: EvaluatedOutcome | null
}

export interface QuestionnaireScoringResult {
  scoringType: QuestionnaireScoringType
  score: number
  resultKey: string
  resultLabel: string
  isRisk: boolean
  recommendation?: string
  categories: EvaluatedCategory[]
  answers: EvaluatedAnswer[]
}

const assertUniqueKeys = (values: string[]) => {
  return new Set(values).size === values.length
}

const assertRanges = (ranges: ScoringResultRange[]) => {
  if (!Array.isArray(ranges) || ranges.length === 0) return false
  if (!assertUniqueKeys(ranges.map((range) => range.key))) return false

  const sorted = [...ranges].sort((a, b) => a.minScore - b.minScore)

  return sorted.every((range, index) => {
    if (
      !range.key?.trim() ||
      !range.label?.trim() ||
      !Number.isFinite(range.minScore) ||
      !Number.isFinite(range.maxScore) ||
      range.minScore > range.maxScore
    ) {
      return false
    }

    const previous = sorted[index - 1]
    return !previous || previous.maxScore < range.minScore
  })
}

export const assertScoringConfiguration = (
  scoringType: QuestionnaireScoringType,
  scoringConfig?: QuestionnaireScoringConfig | null
) => {
  if (scoringType === 'binary_threshold') return

  if (
    !scoringConfig ||
    !Array.isArray(scoringConfig.answerOptions) ||
    scoringConfig.answerOptions.length < 2 ||
    !Array.isArray(scoringConfig.categories) ||
    !scoringConfig.total?.label?.trim() ||
    !assertRanges(scoringConfig.total.ranges)
  ) {
    throw new ErrorResponse.BadRequest('questionnaire.invalidScoringConfig')
  }

  const optionValues = scoringConfig.answerOptions.map((option) => option.value)
  const categoryKeys = scoringConfig.categories.map((category) => category.key)

  const validOptions =
    assertUniqueKeys(optionValues) &&
    scoringConfig.answerOptions.every(
      (option) =>
        option.value?.trim() &&
        option.label?.trim() &&
        Number.isFinite(option.score)
    )

  const validCategories =
    assertUniqueKeys(categoryKeys) &&
    scoringConfig.categories.every(
      (category) =>
        category.key?.trim() &&
        category.label?.trim() &&
        assertRanges(category.ranges)
    )

  const hasTotalSource =
    scoringConfig.categories.length === 0 ||
    scoringConfig.categories.some((category) => category.includeInTotal)

  if (!validOptions || !validCategories || !hasTotalSource) {
    throw new ErrorResponse.BadRequest('questionnaire.invalidScoringConfig')
  }
}

export const assertQuestionScoring = (
  scoringType: QuestionnaireScoringType,
  scoringConfig: QuestionnaireScoringConfig | null | undefined,
  question: Pick<ScorableQuestion, 'scoringCategory' | 'scoreOverrides'>
) => {
  if (scoringType === 'binary_threshold') return

  assertScoringConfiguration(scoringType, scoringConfig)

  const categories = scoringConfig!.categories
  if (
    categories.length > 0 &&
    !categories.some((category) => category.key === question.scoringCategory)
  ) {
    throw new ErrorResponse.BadRequest('questionnaire.invalidQuestionCategory')
  }

  if (question.scoreOverrides) {
    const optionValues = new Set(
      scoringConfig!.answerOptions.map((option) => option.value)
    )

    const validOverrides = Object.entries(question.scoreOverrides).every(
      ([value, score]) => optionValues.has(value) && Number.isFinite(score)
    )

    if (!validOverrides) {
      throw new ErrorResponse.BadRequest(
        'questionnaire.invalidQuestionScoreOverrides'
      )
    }
  }
}

const findOutcome = (
  score: number,
  ranges: ScoringResultRange[]
): EvaluatedOutcome | null => {
  return (
    ranges.find(
      (range) => score >= range.minScore && score <= range.maxScore
    ) ?? null
  )
}

export const evaluateQuestionnaire = ({
  scoringType,
  riskThreshold,
  scoringConfig,
  questions,
  answers,
}: {
  scoringType: QuestionnaireScoringType
  riskThreshold: number
  scoringConfig?: QuestionnaireScoringConfig | null
  questions: ScorableQuestion[]
  answers: ScoringAnswerInput[]
}): QuestionnaireScoringResult => {
  const answerByQuestion = new Map(
    answers.map((answer) => [answer.QuestionId, answer.answerValue])
  )

  if (scoringType === 'binary_threshold') {
    const evaluatedAnswers = questions.map((question) => {
      const answerValue = answerByQuestion.get(question.id) ?? 'false'
      const isTrue = answerValue.toLowerCase() === 'true'

      return {
        QuestionId: question.id,
        answerValue,
        answerLabel: isTrue ? 'Ya' : 'Tidak',
        score: isTrue ? 1 : 0,
        scoringCategory: null,
      }
    })

    const score = evaluatedAnswers.reduce((total, answer) => total + answer.score, 0)
    const isRisk = score >= riskThreshold

    return {
      scoringType,
      score,
      resultKey: isRisk ? 'risk' : 'stable',
      resultLabel: isRisk ? 'Berisiko' : 'Stabil',
      isRisk,
      categories: [],
      answers: evaluatedAnswers,
    }
  }

  assertScoringConfiguration(scoringType, scoringConfig)

  const config = scoringConfig!
  const options = new Map(
    config.answerOptions.map((option) => [option.value, option])
  )

  const evaluatedAnswers = questions.map((question) => {
    const answerValue = answerByQuestion.get(question.id)
    const option = answerValue ? options.get(answerValue) : undefined

    if (!answerValue || !option) {
      throw new ErrorResponse.BadRequest('questionnaire.invalidAnswerOption', {
        id: question.id,
      })
    }

    const score = question.scoreOverrides?.[answerValue] ?? option.score

    return {
      QuestionId: question.id,
      answerValue,
      answerLabel: option.label,
      score,
      scoringCategory: question.scoringCategory ?? null,
    }
  })

  const categories = config.categories.map((category) => {
    const score = evaluatedAnswers
      .filter((answer) => answer.scoringCategory === category.key)
      .reduce((total, answer) => total + answer.score, 0)

    return {
      key: category.key,
      label: category.label,
      includeInTotal: category.includeInTotal,
      score,
      outcome: findOutcome(score, category.ranges),
    }
  })

  const score =
    categories.length > 0
      ? categories
          .filter((category) => category.includeInTotal)
          .reduce((total, category) => total + category.score, 0)
      : evaluatedAnswers.reduce((total, answer) => total + answer.score, 0)

  const outcome = findOutcome(score, config.total.ranges)

  if (!outcome) {
    throw new ErrorResponse.BadRequest('questionnaire.scoreOutsideResultRange')
  }

  return {
    scoringType,
    score,
    resultKey: outcome.key,
    resultLabel: outcome.label,
    isRisk: outcome.isRisk,
    recommendation: outcome.recommendation,
    categories,
    answers: evaluatedAnswers,
  }
}
