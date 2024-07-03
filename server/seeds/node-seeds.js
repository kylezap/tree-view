const { Node } = require('../models');

const nodeData = [
  {
    id: 1,
    parent_id: null,
    name: 'Root',
    node_type: 'root',
    number: 1,
  },
  {
    id: 2,
    parent_id: 1,
    name: 'Awesome Factory',
    node_type: 'factory',
    number: 1,
  },
  {
    id: 3,
    parent_id: 1,
    name: 'Cool Factory',
    node_type: 'factory',
    number: 1,
  },
  {
    id: 4,
    parent_id: 1,
    name: 'Great Factory',
    node_type: 'factory',
    number: 1,
  }
];

const seedTree = () => Node.bulkCreate(nodeData);

module.exports = seedTree;
