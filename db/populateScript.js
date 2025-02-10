// ? why do I need to run this file first?

const { Client } = require('pg');
require('dotenv').config();

// if the sql queries are long, consider extract them into a file to have sql intellision
const SQL = ``;
async function main() {
  console.log('seeding...');
  // connection process
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  // query code
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
