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
    
    const nodeData = await Node.create({ name: nodeName,
      number: req.body.number,
      parent_id: req.body.parent_id
     });
    res.status(200).json(nodeData);
    console.log(nodeName, nodeData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

router.put('/:id', (req, res) => {
  // update a node by its `id` value

});

router.delete('/:id', (req, res) => {
  // delete a node by its `id` value
});

module.exports = router;
