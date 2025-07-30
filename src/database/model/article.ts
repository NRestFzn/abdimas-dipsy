import {
  BelongsTo,
  Column,
  ForeignKey,
  IsUUID,
  Table,
} from 'sequelize-typescript'
import BaseSchema from './_baseModel'
import { DataTypes } from 'sequelize'
import Category from './category'

@Table({ tableName: 'article' })
export default class Article extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  title: string

  @Column({ allowNull: false, type: DataTypes.STRING })
  description: string

  @Column({ allowNull: false, type: DataTypes.STRING })
  image: string

  @Column({ allowNull: false, type: DataTypes.STRING })
  publishedDate: string

  @Column({ allowNull: false, type: DataTypes.ENUM('draft', 'publish') })
  status: string

  @IsUUID(4)
  @ForeignKey(() => Category)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  CategoryId: string

  @BelongsTo(() => Category)
  category: Category
}
