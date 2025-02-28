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