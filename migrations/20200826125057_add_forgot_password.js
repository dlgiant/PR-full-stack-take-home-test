
exports.up = function(knex) {
 return knex.schema.createTable("forgot_password", function (table) {
   table.increments("id");
   table.integer("user_id");
   table.string("reset_token");
   table.timestamps();
 });
};

exports.down = function(knex) {
  return knex.schema.dropTable("forgot_password");
};
