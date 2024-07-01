const router = require('express').Router();
const nodeRoutes = require('./node-routes');


router.use('/nodes', nodeRoutes);

module.exports = router;
