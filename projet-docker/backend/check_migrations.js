const knex = require('knex')(require('./knexfile').development);

async function checkMigrations() {
  try {
    const migrations = await knex('knex_migrations').select('*');
    console.log('Migrations in database:', migrations);
    await knex.destroy();
  } catch (error) {
    console.error('Error:', error);
    await knex.destroy();
  }
}

checkMigrations();
