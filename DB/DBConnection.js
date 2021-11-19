const mySql = require('mysql');

function createConnection  ()  {
    let conn = mySql.createConnection({
        host: '35.238.3.171', 
        user: 'root',
        password: '3316',
        database: 'Lab3',
    });

    return conn;
}

module.exports = createConnection;