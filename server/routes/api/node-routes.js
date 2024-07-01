const router = require('express').Router();
const Node = require('../../models/Node')

// The `/api/nodes` endpoint

router.get('/', async (req, res) => {
  // find all nodes
  try {
    const nodeData = await Node.findAll();
    res.status(200).json(nodeData);
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
    const nodeData = await Node.create(req.body);
    res.status(200).json(nodeData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a node by its `id` value

});

router.delete('/:id', (req, res) => {
  // delete a node by its `id` value
});

module.exports = router;
