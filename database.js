var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.MYSQLPW,
    database: process.env.DATABASEURL || 'empDB'
});
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }
	console.log("middleware connection successful");
    if (connection) connection.release();
	   return;
});
module.exports = pool;