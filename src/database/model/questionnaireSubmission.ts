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

@Table({ tableName: 'questionnaireSubmission' })
export default class QuestionnaireSubmission extends BaseSchema {
  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataTypes.UUID })
  UserId: string

  @IsUUID(4)
  @ForeignKey(() => Questionnaire)
  @Column({ allowNull: false, type: DataTypes.UUID })
  QuestionnaireId: string

  @HasMany(() => QuestionnaireAnswer)
  questionnaireAnswer: QuestionnaireAnswer[]

  @BelongsTo(() => Questionnaire)
  questionnaire: Questionnaire
}
