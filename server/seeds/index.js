const seedTree = require('./node-seeds');

const sequelize = require('../config/connection');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');
  await seedTree();
  console.log('\n----- TREE SEEDED -----\n');

  process.exit(0);
};

seedAll();
