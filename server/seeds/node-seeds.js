const { Node } = require('../models');

const seedTree = async () => {
  // Create the root node
  const rootNode = await Node.create({
    parent_id: null,
    name: 'Root',
    node_type: 'root',
    number: 1,
  });

  // Get the ID of the root node
  const rootId = rootNode.id;

  // Create the factory nodes with the root node's ID as their parent_id
  const nodeData = [
    {
      parent_id: rootId,
      name: 'Awesome Factory',
      node_type: 'factory',
      number: 1,
    },
    {
      parent_id: rootId,
      name: 'Cool Factory',
      node_type: 'factory',
      number: 1,
    },
    {
      parent_id: rootId,
      name: 'Great Factory',
      node_type: 'factory',
      number: 1,
    },
  ];

  await Node.bulkCreate(nodeData);
};

module.exports = seedTree;
