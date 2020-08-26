
exports.up = function(knex) {
 return knex.schema.createTable("forgot_password", function (table) {
   table.increments("id");
   table.integer("user_id");
   table.string("reset_token_digest");
   table.datetime("reset_token_created_at");
   table.timestamps();
 });
};

exports.down = function(knex) {
  return knex.schema.dropTable("forgot_password");
};
