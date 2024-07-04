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

//add cors middleware
const corsOptions = {
  origin: 'https://tree-view.onrender.com', 
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// create a middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} 


// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database URL: ${process.env.DB_URL}`);
})});