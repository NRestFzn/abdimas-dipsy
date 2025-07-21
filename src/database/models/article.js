import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../data-source'
const Category = require('./category')

class Article extends Model {}

Article.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    image: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    publishedDate: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(['draft', 'publish']),
    },
    CategoryId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
  }
)

Article.belongsTo(Category, { foreignKey: 'CategoryId' })

module.exports = Article
