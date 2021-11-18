const mySql = require('mysql');

const { adminUsers, doodleTimeSlots } = require('./DBTables')

let conn = mySql.createConnection({
    host: '35.238.3.171', 
    user: 'root',
    password: '3316',
    database: 'Lab3',
});



conn.connect();


conn.query(`DROP TABLE IF EXISTS ${adminUsers};`
    ,(err,rows,fields) => {   
        if(err) 
            console.log(err);
        else 
            console.log('Table ${adminUsers} Dropped');
    }
);

conn.query(`CREATE TABLE ${adminUsers} ( userName varchar(100), password varchar(100) )`
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
        "password": "anujKpassword"
    },
    {
        "userName": "anujK123",
        "password": "anujK123password"
    }
];

for (admin of admins) {
    conn.query(`
      INSERT INTO ${adminUsers} VALUES (
        '${admin.username}'
        ,'${admin.pwd}'
      );
    `,(err,rows,fields) => {   
    if(err) 
        console.log(err);
    else 
        console.log('Row inserted for user ${adminUsers}');
    }
);
}



conn.query(`SELECT * FROM ${adminUsers}`,
    (err,rows,fields) => {   
    if(err) 
        console.log(err);
    else 
        console.log(fields);
    
    console.log(`Data from ${users} table: `);
    for (let r of rows) 
        console.log(r);
    }
);


conn.query(`DROP TABLE IF EXISTS ${doodleTimeSlots};`, (err) => {
    if (err) 
        console.log(err)
    else
        console.log(`Dropped ${doodleTimeSlots} table`);
  });



conn.query(`CREATE TABLE ${doodleSlots} (
    Name VARCHAR(100)
    ,Slot1 BOOLEAN
    ,Slot2 BOOLEAN
    ,Slot3 BOOLEAN
    ,Slot4 BOOLEAN
    ,Slot5 BOOLEAN
    ,Slot6 BOOLEAN
    ,Slot7 BOOLEAN
    ,Slot8 BOOLEAN
    ,Slot9 BOOLEAN
    ,Slot10 BOOLEAN
);`, (err) => {
    if (err) throw err;

    // success message
    console.log(`Created ${doodleTimeSlots} table`);
});


conn.end();