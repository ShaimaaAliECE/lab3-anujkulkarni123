//requires external modules
const express = require('express');
const mySql = require('mysql');
const createConnection = require('./DB/DBConnection');
const { adminUsers, doodleTimeSlots, availTimeSlots  } = require('./DB/DBTables');
const { getPageInfo, UpdateTimeSlots } = require('./DB/asyncDBQueries');
const path = require('path');

//app variables
const app = express();
const port = 80;
const router = express.Router();

const conn = createConnection();

//initializing app
app.set("view engine", "ejs")
//app.use(express.static('Views'));
app.use('/', router);

app.set('views', path.join(__dirname, 'views'));

// Set the folder for css & java scripts
app.use(express.static(path.join(__dirname,'styles')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

//Initializing app functionalities

//variables
let user = undefined;

let updatedSlots = false;

let addedRows = false;

const slotCount = 10;

//routing 

//route if admin is logged In
router.get('/', (req, res) =>  {
  if (user !== undefined) {
    res.redirect('/DoodleAdmin');
    return;
  }

  res.render('UserLogin');
})

//reads post data
router.use(express.urlencoded({
  extended: true
}));

router.post('/UserLogin', (req, res) => {
  if (user) {
    res.redirect('/DoodleAdmin')
  }

  let userName = req.body.userName.replace('-', ' ');
  let password = req.body.password;

  conn.connect();

  conn.query(`SELECT 
              *
              FROM 
                ${adminUsers}
              WHERE
                userName = \"${userName}\" AND
                password = \"${password}\"
                `, (err, rows, fields) => {
                  if (err)  
                    console.log(err);
                  
                  if (rows.length ===1) {
                    user = userName;
                    res.redirect('/DoodleAdmin');
                  }
                  else {
                    res.redirect('/UserLogin')
                  }
                });
  conn.end();
});

router.get('/UserLogin', (req, res) => {
  res.render('UserLogin', { errMsg: "Username or Password Incorrect, Try Again." })
});

//Route to Guest Login
router.get('/guestView', (req, res) => {
  getPageInfo().then(({doodleTimeSlotEntries, availTimeSlotsEntries}) =>  {
    //determines whether rows are added
    if (addedRows)  {
      addedRows=false;
      res.render('DoodleGuest', { rows: doodleTimeSlotEntries, slotCount: slotCount, availTimeSlots: availTimeSlotsEntries, msg: 'Entry Added'});
    } else {
      res.render('DoodleGuest', { rows: doodleTimeSlotEntries, slotCount: slotCount, availTimeSlots: availTimeSlotsEntries });
    }
  }).catch((err) => {
    console.log(err);
    throw err;
  });
});

//for adding guest data to the database
router.get('/add-guest', (req, res) => {
  // get the name value from the form
  let name = req.query.name.replace('-', ' ');

  if (!name) {
    res.redirect('/guestView');
    return;
  }

  // get the slots value from the form
  let slots = [
    req.query.Slot_1 === "True" ? true : false,
    req.query.Slot_2 === "True" ? true : false,
    req.query.Slot_3 === "True" ? true : false,
    req.query.Slot_4 === "True" ? true : false,
    req.query.Slot_5 === "True" ? true : false,
    req.query.Slot_6 === "True" ? true : false,
    req.query.Slot_7 === "True" ? true : false,
    req.query.Slot_8 === "True" ? true : false,
    req.query.Slot_9 === "True" ? true : false,
    req.query.Slot_10 === "True" ? true : false
  ];


  // connect to the db
  conn.connect();

 
  conn.query(`
      INSERT INTO ${doodleTimeSlots}
      VALUES
        (\"${name}\", ${slots[0]}, ${slots[1]}, ${slots[2]}, ${slots[3]}, ${slots[4]}, ${slots[5]}, ${slots[6]}, ${slots[7]}, ${slots[8]}, ${slots[9]});
    `, (err) => {
      if (err) throw err;

      console.log('Insert Completed Successfully.');

    // passing value to variable to let the guest-view show a success message
      addedRows = true;

      // redirect back to the page
      res.redirect('/guestView');
      return;
    });

  // close the connection
  conn.end();
});

router.get('/DoodleAdmin', (req, res) => {
  // if the user is not logged in then redirect them to the home page
  if ( user === undefined)
  {
    res.redirect('/');
    return;
  }

  getPageInfo().then(({doodleSlotEntries, availTimeSlotsEntries}) => {
    // if statement to determine whether the timeSlots were updated or not
    if (updatedSlots) {
      updatedSlots = false;
      res.render('DoodleAdmin', {user: user, availTimeSlots: availTimeSlotsEntries, rows: doodleSlotEntries, slotCount: slotCount, msg: 'Successfully Updated the Slots!'})
    } else {
      res.render('DoodleAdmin', {user: user, availTimeSlots: availTimeSlotsEntries, rows: doodleSlotEntries, slotCount: slotCount})
    }
  }).catch((err) => {
    throw err;
  });

});

// update the slots from the admin
router.get('/updateSlots', async (req, res) => {
  // to prevent unauthenticated use
  if (!user) {
    res.redirect('/');
    return;
  }

  // values for the slots from the form
  let slotValues = {
    "Slot1": req.query.Slot1,
    "Slot2": req.query.Slot2,
    "Slot3": req.query.Slot3,
    "Slot4": req.query.Slot4,
    "Slot5": req.query.Slot5,
    "Slot6": req.query.Slot6,
    "Slot7": req.query.Slot7,
    "Slot8": req.query.Slot8,
    "Slot9": req.query.Slot9,
    "Slot10": req.query.Slot10
  }

  // call the async function to update the values of the timeSlots table
  updateTimeSlots(slotValues).then(() => {
    
    // print the success message
    console.log(`Successfully Updated ${availTimeSlots} Table`);

    // passing value to variable to let the admin-view show a success message
    updatedSlots = true;

    
    res.redirect('/DoodleAdmin');
    return;

  }).catch((err) => {
    throw err;
  });
});

//Quitting
router.get('/logout', (req, res) => {
  user = undefined;

  res.redirect('/');
  return;
});
