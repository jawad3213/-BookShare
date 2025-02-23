exports.up = function(knex) {
  return knex.schema.alterTable("utilisateurs",function(table){
    table.enu("type", ["administrateur", "client"]);
  });  
};


exports.down = function(knex) {
  return knex.schema.dropColumn("type");
};