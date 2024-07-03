require('dotenv').config();

const Sequelize = require('sequelize');

let sequelize;

if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL);
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost', // Change to your actual host
    dialect: 'postgres',
    dialectOptions: {
      decimalNumbers: true,
    },
  });
}

module.exports = sequelize;