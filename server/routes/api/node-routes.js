const router = require('express').Router();
const Node = require('../../models/Node');
const randomCode = require('../../utils/randomCode');

// The `/api/nodes` endpoint

router.get('/', async (req, res) => {
  // find all nodes
  try {
    const nodeData = await Node.findAll();
    res.status(200).json(nodeData);
    console.log('"Success!"');
  } catch (err) {
    console.error('Error occurred:', err);  // Log the detailed error to the console

    // Send a detailed error response
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : 'stack hidden'
    });
  }
});

router.post('/batch', async (req, res) => {
  // create multiple 'number' nodes
  const { parentId, nodes } = req.body;
  try {
    const newNodes = await Node.bulkCreate(
      nodes.map(number => ({
        name: `Number ${number}`,
        node_type: 'number',
        parent_id: parentId,
        number: number,
      }))
    );

    res.status(201).json(newNodes);
  } catch (error) {
    console.error('Error creating nodes:', error);
    res.status(500).send('Error creating nodes');
  } 
});

router.post('/', async(req, res) => {
  // create a new node
  try {
    const nodeName = randomCode();

    if (!req.body.number || !req.body.parent_id) {
      return res.status(400).json({ error: 'Missing required fields: number or parent_id' });
    }
    
    const nodeData = await Node.create({ name: req.body.name,
      number: req.body.number,
      parent_id: req.body.parent_id,
      node_type: req.body.node_type
     });
    res.status(200).json(nodeData);
    console.log(nodeData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; // Expect 'name' in the request body

  try {
    const [updatedRows] = await Node.update({ name }, {
      where: { id: id }
    });

    if (updatedRows === 0) {
      return res.status(404).send('Node not found');
    }

    const updatedNode = await Node.findByPk(id);
    res.json(updatedNode); // Return the updated node as JSON
  } catch (error) {
    console.error('Error updating node name:', error);
    res.status(500).json({ error: 'Error updating node name' }); // Send JSON error response
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const node = await Node.findByPk(id);

    if (!node) {
      return res.status(404).send('Node not found');
    }

    await node.destroy();
    res.send('Node and its children deleted successfully');
  } catch (error) {
    console.error('Error deleting node:', error);
    res.status(500).send('Error deleting node');
  }
});


router.delete('/clear/:parentId', async (req, res) => {
  const { parentId } = req.params;

  try {
    const deletedRows = await Node.destroy({
      where: {
        parent_id: parentId,
        node_type: 'number',
      },
    });

    res.send(`${deletedRows} nodes deleted successfully`);
  } catch (error) {
    console.error('Error deleting nodes:', error);
    res.status(500).send('Error deleting nodes');
  }
});


module.exports = router;
