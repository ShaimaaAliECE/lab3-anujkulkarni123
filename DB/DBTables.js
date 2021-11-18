const mySql = require('mysql');

let conn = mySql.createConnection({
    host: '35.238.3.171', 
    user: 'root',
    password: '3316',
    database: 'Lab3',
});

module.exports = {
    createDBConnection: createDBConnection,
    adminUsers: 'AdminUsers',
    doodleTimeSlots: 'DoodleTimeSlots'
}

