const express = require('express');
const routes = require('./routes');
// import sequelize connection
const sequelize = require('./config/connection');

// import models
const Node = require('./models/Node');

// create express app
const app = express();

// create a PORT
const PORT = process.env.PORT || 3001;

// create a middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
})});
