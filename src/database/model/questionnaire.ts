import { Column, HasMany, Table } from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import QuestionnaireQuestion from './questionnaireQuestion'
import QuestionnaireSubmission from './questionnaireSubmission'

@Table({ tableName: 'questionnaire' })
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

  @HasMany(() => QuestionnaireQuestion)
  questions: QuestionnaireQuestion[]

  @HasMany(() => QuestionnaireSubmission)
  submissions: QuestionnaireQuestion[]
}
