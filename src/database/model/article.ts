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
import User from './user'

@Table({ tableName: 'article' })
export default class Article extends BaseSchema {
  @Column({ allowNull: false, type: DataTypes.STRING })
  title: string

  @Column({ allowNull: false, type: DataTypes.STRING })
  description: string

  @Column({ allowNull: false, type: DataTypes.STRING })
  image: string

  @Column({ allowNull: true, type: DataTypes.DATE })
  publishedDate: Date | null

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

  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  AuthorId: string

  @BelongsTo(() => User)
  author: User
}
