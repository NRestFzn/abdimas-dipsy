import { Column, HasMany, Table } from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import Questionnaire from './questionnaire'

@Table({ freezeTableName: true, tableName: 'questionnaire_categories' })
export default class QuestionnaireCategory extends BaseSchema {
  @Column({
    allowNull: false,
    type: DataTypes.STRING,
    unique: {
      name: 'unique_questionnaire_category',
      msg: 'Duplicate Questionnaire Category Entry',
    },
  })
  name: string

  @HasMany(() => Questionnaire)
  questionnaires: Questionnaire[]
}
