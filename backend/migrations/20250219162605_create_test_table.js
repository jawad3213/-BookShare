exports.up = function(knex) {
    return knex.schema.createTable("test", function(table) {
      table.increments("id").primary();
    });
  };
  
exports.down = function(knex) {
  return knex.schema.dropTable("test");
};
  