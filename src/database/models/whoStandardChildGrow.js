import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../data-source'
import { hashSync } from 'bcrypt'

class WhoStandardChildGrow extends Model {}

WhoStandardChildGrow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    gender: {
      type: DataTypes.ENUM(['m', 'f']),
    },
    L: {
      type: DataTypes.DECIMAL(14, 10),
    },
    M: {
      type: DataTypes.DECIMAL(14, 10),
    },
    S: {
      type: DataTypes.DECIMAL(14, 10),
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
    tableName: 'whoStandardChildGrows',
  }
)

module.exports = WhoStandardChildGrow
