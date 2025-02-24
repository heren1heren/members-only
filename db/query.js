const pool = require('./pool');
async function insertUser(
  firstName,
  lastName,
  username,
  hashedPassword,
  membership_code
) {
  // membership_code == 1 -> users
  // membership_code == 2 -> admin

  await pool.query(
    'insert into users (firstName,lastName,username,password,membership_code) values ($1, $2, $3,$4,$5)',
    [firstName, lastName, username, hashedPassword, membership_code]
  );
}
async function getUserByUsername(username) {
  const { rows } = await pool.query(
    `SELECT * FROM users 
                                         WHERE username = $1`,
    [username]
  );
  return rows;
}
module.exports = {
  insertUser,
  getUserByUsername,
};
