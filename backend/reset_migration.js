const knex = require('knex')(require('./knexfile').development);

async function resetMigration() {
  try {
    await knex('knex_migrations')
      .where('name', 'like', '%create_notifications_table%')
      .del();
    console.log('Migration record removed');
    await knex.destroy();
  } catch (error) {
    console.error('Error:', error);
    await knex.destroy();
  }
}

resetMigration();
