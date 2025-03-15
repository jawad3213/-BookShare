module.exports = {
    development: {
      client: 'pg',
      connection:'postgresql://neondb_owner:npg_gQkZABGf16aF@ep-patient-darkness-a9u8pdsr-pooler.gwc.azure.neon.tech/bookshare?sslmode=require',
      migrations: {
        tableName: 'knex_migrations',
        directory: './migrations'
      }
    }
};
/* for test:
module.exports = {
  development: {
    client: 'pg',
    connection: 'postgresql://neondb_owner:npg_gQkZABGf16aF@ep-patient-darkness-a9u8pdsr-pooler.gwc.azure.neon.tech/bookshare?sslmode=require',
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
  },
  test: {
    client: 'pg',
    connection: 'postgresql://neondb_owner:npg_gQkZABGf16aF@ep-patient-darkness-a9u8pdsr-pooler.gwc.azure.neon.tech/bookshare_test?sslmode=require', // Use a separate test database
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
  },
--> pour une base de données de test
  ou
--> pour une SQLite en mémoire
  test: {
    client: 'sqlite3',
    connection: ':memory:',  // Base temporaire en mémoire
    useNullAsDefault: true,  // Pour éviter les erreurs avec SQLite
    migrations: { directory: './migrations' },
  }
};
*/