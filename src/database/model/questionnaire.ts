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
import QuestionnaireQuestion from './questionnaireQuestion'
import QuestionnaireSubmission from './questionnaireSubmission'
import QuestionnaireCategory from './questionnaireCategory'

@Table({ freezeTableName: true, tableName: 'questionnaires' })
export default class Questionnaire extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  title: string

  @Column({ allowNull: false, type: DataTypes.STRING })
  description: string

  @Column({ allowNull: false, type: DataTypes.ENUM('draft', 'publish') })
  status: string

  @Column({ allowNull: false, type: DataTypes.NUMBER })
  riskThreshold: number

  @Column({ allowNull: false, type: DataTypes.NUMBER })
  cooldownInMinutes: number

  @IsUUID(4)
  @ForeignKey(() => QuestionnaireCategory)
  @Column({ allowNull: false, type: DataTypes.UUID })
  CategoryId: string

  @BelongsTo(() => QuestionnaireCategory)
  category: QuestionnaireCategory

  @HasMany(() => QuestionnaireQuestion)
  questions: QuestionnaireQuestion[]

  @HasMany(() => QuestionnaireSubmission)
  submissions: QuestionnaireQuestion[]
}
