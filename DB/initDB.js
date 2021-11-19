// initializing constants
const { adminUsers, doodleTimeSlots, availTimeSlots  } = require('./DBTables')

const createConnection = require('./DBConnection');

const conn = createConnection();

//connecting with DB
conn.connect();


conn.query(`DROP TABLE IF EXISTS ${adminUsers};`
    ,(err,rows,fields) => {   
        if(err) 
            console.log(err);
        else 
            console.log('Table ${adminUsers} Dropped');
    }
);

conn.query(`CREATE TABLE ${adminUsers} ( userName varchar(100), password varchar(100) );`
            ,(err,rows,fields) => {   
            if(err) 
                console.log(err);
            else 
                console.log('Table Created');
    }
);

//inserting some info
const admins = [
    {
        "userName": "anujK",
        "password": "anujK"
    },
    {
        "userName": "anujK123",
        "password": "anujK123"
    }
];

for (admin of admins) {
    conn.query(`
      INSERT INTO ${adminUsers} VALUES (
        '${admin.userName}'
        ,'${admin.password}'
      );
    `,(err,rows,fields) => {   
    if(err) 
        console.log(err);
    else 
        console.log('Row inserted for user ${adminUsers}');
    }
);
}

conn.query(`SELECT 
            * 
            FROM 
                ${adminUsers}`,
    (err,rows,fields) => {   
    if(err) 
        console.log(err);
    else 
        console.log(fields);
    
    console.log(`Data from ${adminUsers} table: `);
    for (let r of rows) 
        console.log(r);
    }
);


conn.query(`DROP TABLE IF EXISTS ${doodleTimeSlots};`, (err,rows,fields) => {
    if (err,rows,fields)  
        console.log(err)
    else
        console.log(`Dropped ${doodleTimeSlots} table`);
      });

conn.query(`CREATE TABLE ${doodleTimeSlots} (
    Name VARCHAR(100)
    ,Slot0 BOOLEAN
    ,Slot1 BOOLEAN
    ,Slot2 BOOLEAN
    ,Slot3 BOOLEAN
    ,Slot4 BOOLEAN
    ,Slot5 BOOLEAN
    ,Slot6 BOOLEAN
    ,Slot7 BOOLEAN
    ,Slot8 BOOLEAN
    ,Slot9 BOOLEAN
);`, (err,rows,fields) => {
    if(err) 
        console.log(err);

    // success message
    console.log(`Created ${doodleTimeSlots} table`);
});

conn.query(`DROP TABLE IF EXISTS ${availTimeSlots};`, (err) => {
    if(err) 
        console.log(err);
  
    // success message
    console.log(`Table ${availTimeSlots} dropped`);
  });
  
  // query to create table
  conn.query(`
    CREATE TABLE ${availTimeSlots} (
      SlotName VARCHAR(100)
      ,SlotValue VARCHAR(100)
    );
  `, (err,rows,fields) => {
    if (err) 
        console.log(err);
  
      // success message
      console.log(`Successfully Created ${availTimeSlots} table`);
  });
  
  // Default Data for TimeSlot Table
  const timeSlotData = {
    'Slot0': '8:00am',
    'Slot1': '9:00am',
    'Slot2': '10:00am',
    'Slot3': '11:00am',
    'Slot4': '12:00pm',
    'Slot5': '1:00pm',
    'Slot6': '2:00pm',
    'Slot7': '3:00pm',
    'Slot8': '4:00pm',
    'Slot9': '5:00pm'
  }
  
  // add data to the timeSlot table by looping over the above data
  for (let key in timeSlotData) {
    conn.query(`
        INSERT INTO ${availTimeSlots} VALUES
          ('${key}', '${timeSlotData[key]}');
    `, (err,rows,fields) => {
    if (err) 
        console.log(err);
  
      // success message
      console.log(`Successfully added Slot to ${availTimeSlots} table`);
    });
  }

  conn.query(`SELECT 
            * 
            FROM 
                ${availTimeSlots}`,
    (err,rows,fields) => {   
    if(err) 
        console.log(err);
    else 
        console.log(fields);
    
    console.log(`Data from ${availTimeSlots} table: `);
    for (let r of rows) 
        console.log(r);
    }
);

//ending connection to DB
conn.end();