const { KnownDirectivesRule } = require("graphql");
const moment = require("moment");
const { onUpdateTrigger, onInsertTrigger, onMergeForgotPasswordFunction } = require("../../knexfile");

exports.up = function(knex){
 return knex.schema.createTable("forgot_password", (table) => {
   table.increments("id");
   table.integer("user_id").unique();
   table.foreign("user_id").references("users.id");
   table.string("token");
   table.integer("count_checks").defaultTo(0); // Increases every time client start forgot password process
   table.boolean("setting_password").defaultTo(false); // Set to true only after user clicks reset link
   table.datetime("expires").defaultTo(moment().add(5, 'minutes').format());   
   table.timestamp('created_at').defaultTo(moment().format());
   table.timestamp('updated_at').defaultTo(moment().format());
 })
 .then(() => knex.raw(onUpdateTrigger('forgot_password')))
};

exports.down = function(knex) {
  return knex.schema.dropTable("forgot_password");
};
