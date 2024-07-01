const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Node extends Model {}

Node.init(
  {
    // define columns
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'node',
  }
);

module.exports = Node;
