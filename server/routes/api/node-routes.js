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
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  // find one node by its `id` value
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
  // update a node by its `id` value
  const { id } = req.params;
  const { newName } = req.body;

  try {
    const [updatedRows] = await Node.update({ name: newName }, {
      where: { id: id }
    });

    if (updatedRows === 0) {
      // No rows updated implies node not found
      return res.status(404).send('Node not found');
    }

    res.send('Node name updated successfully');
  } catch (error) {
    console.error('Error updating node name:', error);
    res.status(500).send('Error updating node name');
  }
});

router.delete('/:id', async (req, res) => {
  // delete a node by its `id` value
  const { id } = req.params;

  try {
    const deletedRows = await Node.destroy({
      where: { id: id }
    });

    if (deletedRows === 0) {
      // No rows deleted implies node not found
      return res.status(404).send('Node not found');
    }

    res.send('Node deleted successfully');
  } catch (error) {
    console.error('Error deleting node:', error);
    res.status(500).send('Error deleting node');
  }
});

module.exports = router;
