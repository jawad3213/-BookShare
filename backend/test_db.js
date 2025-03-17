const { Pool } = require("pg");
const { exec } = require("child_process");



const neonDB = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_gQkZABGf16aF@ep-patient-darkness-a9u8pdsr-pooler.gwc.azure.neon.tech/bookshare?sslmode=require",
  ssl: { rejectUnauthorized: false },
});


const localDB = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test_bookshare", //pour que si on supprime on doit pas etre connecte a test
  //database: "postgres",
  password: "NaDa2004",
  port: 5432,
});


const dumpFile = "backup_bookshare.sql";

async function copyDatabase() {
  try {
    console.log("🔄 Exportation de la base de données depuis Neon Tech...");

    
    await new Promise((resolve, reject) => {// attendre await pour finir lexecution
      exec( // exec pour les commands shell 
        `pg_dump "postgresql://neondb_owner:npg_gQkZABGf16aF@ep-patient-darkness-a9u8pdsr-pooler.gwc.azure.neon.tech/bookshare?sslmode=require" -F p -f ${dumpFile} --no-owner --no-privileges`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`❌ Erreur lors de l'exportation : ${error.message}`);
            reject(error); //erreurinterompe process
          } else {
            console.log("✅ Exportation réussie !");
            resolve(); //opp done
          }
        }
      );
    });

  
    
    console.log("🔄 Suppression de l'ancienne base locale...");
    await localDB.query(`DROP DATABASE IF EXISTS test_bookshare;`);

    
    console.log("🔄 Création de la base locale...");
    await localDB.query(`CREATE DATABASE test_bookshare;`);

    
    
    console.log("🔄 Restauration de la base en local...");
    await new Promise((resolve, reject) => {
      exec(`psql -U postgres -d test_bookshare -f ${dumpFile}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Erreur lors de la restauration : ${error.message}`);
          reject(error);
        } else {
          console.log("✅ Base de test créée avec succès !");
          resolve();
        }
      });
    });

  } catch (err) {
    console.error("❌ Erreur générale :", err);
  } finally {
    await neonDB.end();
    //await localDB.end();
  }
}


if (require.main === module) {
  copyDatabase();
}


module.exports = localDB;