import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../data-source'
const User = require('./user')

class Child extends Model {}

Child.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    fullname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    birthDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    birthCondition: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    gender: {
      allowNull: false,
      type: DataTypes.ENUM(['m', 'f']),
    },
    ParentId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'users',
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
    tableName: 'childs',
  }
)

Child.belongsTo(User, { foreignKey: 'ParentId' })

module.exports = Child
