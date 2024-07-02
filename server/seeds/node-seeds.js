const { Node } = require('../models');

const nodeData = [
  {
    id: 1,
    parent_id: null,
    name: 'Root',
    node_type: 'root',
    number: 1,
  }
];

const seedTree = () => Node.bulkCreate(nodeData);

module.exports = seedTree;
