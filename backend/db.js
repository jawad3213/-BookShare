const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_gQkZABGf16aF@ep-patient-darkness-a9u8pdsr-pooler.gwc.azure.neon.tech/bookshare?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;


