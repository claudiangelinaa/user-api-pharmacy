const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'sasako98',
    database: 'pharmacy_db',
    port: '3306',
    multipleStatements: true
});

module.exports = pool;