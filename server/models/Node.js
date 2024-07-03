const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection.js");
const { v4: uuidv4 } = require("uuid");

class Node extends Model {}

Node.init(
  {
    id: {
      type: DataTypes.UUID, // Change type to UUID
      defaultValue: uuidv4, // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    parent_id: {
      type: DataTypes.UUID, // Change type to UUID
      references: {
        model: "node",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
      },
    },
    node_type: {
      type: DataTypes.ENUM("factory", "number", "root"),
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "node",
  }
);

module.exports = Node;
