const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.USERDB_NAME,
    password: process.env.USERPASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DB_NAME
})

module.exports = client;