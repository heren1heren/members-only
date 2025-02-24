// ? why do I need to run this file first?

const { Client } = require('pg');
require('dotenv').config();

// if the sql queries are long, consider extract them into a file to have sql intellision
const SQL = `-- Create the membership_status table

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS membership_status;

CREATE TABLE  membership_status (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL
);

-- Create the users table
CREATE TABLE  users (
    id SERIAL PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    membership_code INT,
    FOREIGN KEY (membership_code) REFERENCES membership_status(id)
);

-- Create the messages table
CREATE TABLE   messages (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    authorId INT,
    FOREIGN KEY (authorId) REFERENCES users(id)
);

INSERT INTO membership_status(type) VALUES
 ('user'),
 ('admin')

`;
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
