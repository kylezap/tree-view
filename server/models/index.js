const Node = require('./Node');

Node.hasMany(Node, { 
    as: 'Children', 
    foreignKey: 'parent_id', 
    onDelete: 'CASCADE' });
Node.belongsTo(Node, { 
    as: 'Parent', 
    foreignKey: 'parent_id' });

module.exports = { Node };

