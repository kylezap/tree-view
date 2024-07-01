const router = require('express').Router();
const { Node } = require('../../models');

// The `/api/nodes` endpoint

router.get('/', (req, res) => {
  // find all nodes
});

router.get('/:id', (req, res) => {
  // find one node by its `id` value
});

router.post('/', (req, res) => {
  // create a new node
});

router.put('/:id', (req, res) => {
  // update a node by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a node by its `id` value
});

module.exports = router;
