const express = require('express');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');

// import sequelize connection
const sequelize = require('./config/connection');

// import models
const Node = require('./models/Node');

// create express app
const app = express();

// create a PORT
const PORT = process.env.PORT || 3001;

// create a middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} 

// turn on routes
app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URL: ${process.env.DB_URL}`);
})});