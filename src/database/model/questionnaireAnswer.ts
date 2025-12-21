import {
  BelongsTo,
  Column,
  ForeignKey,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import QuestionnaireSubmission from './questionnaireSubmission'
import QuestionnaireQuestion from './questionnaireQuestion'

@Table({ tableName: 'questionnaire_answers' })
export default class QuestionnaireAnswer extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  answerValue: string

  @IsUUID(4)
  @ForeignKey(() => QuestionnaireQuestion)
  @Column({ allowNull: false, type: DataTypes.UUID })
  QuestionnaireQuestionId: string

  @IsUUID(4)
  @ForeignKey(() => QuestionnaireSubmission)
  @Column({ allowNull: false, type: DataTypes.UUID })
  QuestionnaireSubmissionId: string

  @BelongsTo(() => QuestionnaireQuestion)
  questionnaireQuestion: QuestionnaireQuestion
}
