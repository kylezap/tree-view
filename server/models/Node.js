const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection.js");

class Node extends Model {}

Node.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_id: {
      type: DataTypes.INTEGER,
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
