const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'library',
    user: process.env.DB_USER || 'libraryuser',
    password: process.env.DB_PASSWORD,
    ssl: false,
});

module.exports = pool;