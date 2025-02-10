const { Pool } = require('pg');
require('dotenv').config();
// Again, this should be read from an environment variable
module.exports = new Pool({
  connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@localhost:5432/top_users`,
});
