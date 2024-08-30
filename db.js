// db.js
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'flags',
    password: 'shefat',
    port: 5432,
});

client.connect();

module.exports = client;
