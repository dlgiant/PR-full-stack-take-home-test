
exports.up = function(knex) {
 return knex.schema.createTable("forgot_password", function (table) {
   table.increments("id")
   table.integer("user_id");
   table.string("token_digest");
   table.integer("count_checks"); // Increases every time client start forgot password process
   table.boolean("setting_password"); // Set to true only after user clicks reset link
   table.datetime("expires"); 
   table.timestamps();
 });
};

exports.down = function(knex) {
  return knex.schema.dropTable("forgot_password");
};
