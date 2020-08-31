const ON_INSERT_FORGOT_PASSWORD_FUNCTION = `
CREATE OR REPLACE FUNCTION on_merge_forgot_password(new_user_id INT, new_token BIGINT)
  RETURNS trigger AS $$
  BEGIN
    LOOP
      UPDATE forgot_password
      SET token = new_token
      WHERE user_id = new_user_id
      IF found THEN
        RETURN;
      END IF;

      BEGIN
        INSERT INTO forgot_password(user_id, token)
        VALUES (new_user_id, new_token)
        RETURN;
      EXCEPTION WHEN unique_violation THEN
      END;

    END LOOP;
  END;
$$ language 'plpgsql';
`

const DROP_ON_INSERT_FORGOT_PASSWORD_FUNCTION = `
  DROP FUNCTION on_merge_forgot_password
`

exports.up = knex => knex.raw(ON_INSERT_FORGOT_PASSWORD_FUNCTION)
exports.down = knex => knex.raw(DROP_ON_INSERT_FORGOT_PASSWORD_FUNCTION)



// INSERT INTO forgot_password (user_id, token)
// VALUES (OLD.user_id, OLD.token)
// ON CONFLICT (user_id) DO UPDATE 
// SET count_checks = OLD.count_checks+1;
// RETURN NEW;