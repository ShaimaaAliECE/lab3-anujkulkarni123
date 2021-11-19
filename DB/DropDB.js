// initializing constants
const { adminUsers, doodleTimeSlots, availTimeSlots  } = require('./DBTables')

const createConnection = require('./DBConnection');

const conn = createConnection();


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

// drop table if it already exists
conn.query(`DROP TABLE IF EXISTS ${availTimeSlots};`, (err) => {
    if (err) throw err;
  
    // success message
    console.log(`Dropped ${availTimeSlots} Table`);
  });

    
