import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../data-source'
const Child = require('./childs')

class GrowMilestones extends Model {}

GrowMilestones.init(
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
    reachedDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
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
    tableName: 'growMilestones',
  }
)

GrowMilestones.belongsTo(Child, { foreignKey: 'ChildId' })

module.exports = GrowMilestones
