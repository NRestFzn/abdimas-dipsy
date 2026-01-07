import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import Questionnaire from './questionnaire'
import User from './user'
import QuestionnaireAnswer from './questionnaireAnswer'

@Table({ freezeTableName: true, tableName: 'questionnaire_submissions' })
export default class QuestionnaireSubmission extends BaseSchema {
  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataTypes.UUID })
  UserId: string

  @IsUUID(4)
  @ForeignKey(() => Questionnaire)
  @Column({ allowNull: false, type: DataTypes.UUID })
  QuestionnaireId: string

  @Column({ allowNull: false, type: DataTypes.UUID })
  SubmittedBy: string

  @Column({ allowNull: false, type: DataTypes.BOOLEAN })
  isAssisted: boolean

  @HasMany(() => QuestionnaireAnswer)
  questionnaireAnswer: QuestionnaireAnswer[]

  @BelongsTo(() => Questionnaire)
  questionnaire: Questionnaire

  @BelongsTo(() => User)
  user: User
}
