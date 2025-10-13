import { Column, ForeignKey, IsUUID, Table } from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import Questionnaire from './questionnaire'

@Table({ tableName: 'questionnaireQuestion' })
export default class QuestionnaireQuestion extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  questionText: string

  @Column({ allowNull: false, type: DataTypes.STRING })
  questionType: string

  @Column({ allowNull: false, type: DataTypes.ENUM('draft', 'publish') })
  status: string

  @Column({ allowNull: false, type: DataTypes.NUMBER })
  order: number

  @IsUUID(4)
  @ForeignKey(() => Questionnaire)
  @Column({ allowNull: false, type: DataTypes.UUID })
  QuestionnaireId: string
}
