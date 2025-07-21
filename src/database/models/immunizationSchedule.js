import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../data-source'
const Child = require('./childs')

class ImmunizationSchedule extends Model {}

ImmunizationSchedule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    vaccineName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    ChildId: {
      allowNull: false,
      type: DataTypes.UUID,
      references: {
        model: 'childs',
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
    tableName: 'immunizationSchedules',
  }
)

ImmunizationSchedule.belongsTo(Child, { foreignKey: 'ChildId' })

module.exports = ImmunizationSchedule
