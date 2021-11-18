const { adminUsers, doodleTimeSlots } = require('./DBTables');

let conn = mySql.createConnection({
    host: '35.238.3.171', 
    user: 'root',
    password: '3316',
    database: 'Lab3',
});


//connecting to DB
conn.connect();

//dropping doodletimeslots
conn.query(`DROP TABLE ${doodleTimeSlots}`, (err) => {
    if (err) 
        console.log(err)
    else
        console.log(`Dropped ${doodleTimeSlots} table`);
});

//dropping adminUser
conn.query(`DROP TABLE ${adminUsers}`, (err) => {
    if (err) 
        console.log(err)
    else
        console.log(`Dropped ${adminUsers} table`);
});

    
