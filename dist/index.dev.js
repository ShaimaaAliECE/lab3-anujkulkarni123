"use strict";

//requires external modules
var express = require('express');

var createConnection = require('./DB/DBConnection');

var _require = require('./DB/DBTables'),
    adminUsers = _require.adminUsers,
    doodleTimeSlots = _require.doodleTimeSlots,
    availTimeSlots = _require.availTimeSlots;

var _require2 = require('./DB/asyncDBQueries'),
    getPageData = _require2.getPageData,
    updateTimeSlots = _require2.updateTimeSlots;

var path = require('path');

var bodyParser = require('body-parser'); //app variables


var app = express();
var port = 80;
var router = express.Router();
var conn = createConnection(); //initializing app

app.set("view engine", "ejs"); //app.use(express.static('Views'));

app.use('/', router);
app.set('views', path.join(__dirname, 'views')); // Set the folder for css & java scripts

app.use(express["static"](path.join(__dirname, 'styles')));
app.use(express["static"](path.join(__dirname, 'node_modules')));
app.listen(port, function () {
  console.log("Example app listening at http://localhost:".concat(port));
}); //Initializing app functionalities
//variables

var user = undefined;
var updatedSlots = false;
var addedRows = false;
var slotCount = 10; //routing 
//route if admin is logged In

router.get('/', function (req, res) {
  if (user !== undefined) {
    res.redirect('/DoodleAdmin');
    return;
  }

  res.render('UserLogin');
}); //reads post data

router.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
router.post('/UserLogin', function (req, res) {
  if (user) {
    res.redirect('/DoodleAdmin');
  }

  var userName = req.body.userName.replace('-', ' ');
  var password = req.body.password;
  conn.connect();
  conn.query("SELECT \n              *\n              FROM \n                ".concat(adminUsers, "\n              WHERE\n                userName = \"").concat(userName, "\" AND\n                password = \"").concat(password, "\"\n                "), function (err, rows, fields) {
    if (err) console.log(err);

    if (rows.length === 1) {
      user = userName;
      res.redirect('/DoodleAdmin');
    } else {
      res.redirect('/UserLogin');
    }
  });
  conn.end();
});
router.get('/UserLogin', function (req, res) {
  res.render('UserLogin', {
    errMsg: "Username or Password Incorrect, Try Again."
  });
}); //Route to Guest Login

router.get('/guestView', function (req, res) {
  getPageData().then(function (_ref) {
    var doodleTimeSlotEntries = _ref.doodleTimeSlotEntries,
        availTimeSlotsEntries = _ref.availTimeSlotsEntries;
    console.log(availTimeSlotsEntries); //determines whether rows are added

    if (addedRows) {
      addedRows = false;
      res.render('DoodleGuest', {
        rows: doodleTimeSlotEntries,
        slotCount: slotCount,
        availTimeSlots: availTimeSlotsEntries,
        msg: 'Entry Added'
      });
    } else {
      res.render('DoodleGuest', {
        rows: doodleTimeSlotEntries,
        slotCount: slotCount,
        availTimeSlots: availTimeSlotsEntries
      });
    }
  })["catch"](function (err) {
    console.log(err);
  });
}); //for adding guest data to the database

router.get('/addGuest', function (req, res) {
  // get the name value from the form
  var guestName = req.query.name.replace('-', ' ');

  if (!guestName) {
    res.redirect('/guestView');
    return;
  } // get the slots value from the form


  var slots = [req.query.slot_0 === "True" ? true : false, req.query.slot_1 === "True" ? true : false, req.query.slot_2 === "True" ? true : false, req.query.slot_3 === "True" ? true : false, req.query.slot_4 === "True" ? true : false, req.query.slot_5 === "True" ? true : false, req.query.slot_6 === "True" ? true : false, req.query.slot_7 === "True" ? true : false, req.query.slot_8 === "True" ? true : false, req.query.slot_9 === "True" ? true : false]; // connect to the db

  conn.connect();
  conn.query("\n      INSERT INTO ".concat(doodleTimeSlots, "\n      VALUES\n        (\"").concat(guestName, "\", ").concat(slots[0], ", ").concat(slots[1], ", ").concat(slots[2], ", ").concat(slots[3], ", ").concat(slots[4], ", ").concat(slots[5], ", ").concat(slots[6], ", ").concat(slots[7], ", ").concat(slots[8], ", ").concat(slots[9], ");\n    "), function (err) {
    if (err) throw err;
    console.log('Insert Completed Successfully.'); // passing value to variable to let the guest-view show a success message

    addedRows = true; // redirect back to the page

    res.redirect('/guestView');
    return;
  }); // close the connection

  conn.end();
});
router.get('/DoodleAdmin', function (req, res) {
  // if the user is not logged in then redirect them to the home page
  if (user === undefined) {
    res.redirect('/DoodleAdmin');
    return;
  }

  getPageData().then(function (_ref2) {
    var doodleTimeSlotEntries = _ref2.doodleTimeSlotEntries,
        availTimeSlotsEntries = _ref2.availTimeSlotsEntries;

    // if statement to determine whether the timeSlots were updated or not
    if (updatedSlots) {
      updatedSlots = false;
      res.render('DoodleAdmin', {
        user: user,
        availTimeSlots: availTimeSlotsEntries,
        rows: doodleTimeSlotEntries,
        slotCount: slotCount,
        msg: 'Successfully Updated the Slots!'
      });
    } else {
      res.render('DoodleAdmin', {
        user: user,
        availTimeSlots: availTimeSlotsEntries,
        rows: doodleTimeSlotEntries,
        slotCount: slotCount
      });
    }
  })["catch"](function (err) {
    throw err;
  });
}); // update the slots from the admin

router.get('/updateSlots', function _callee(req, res) {
  var slotValues;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (user) {
            _context.next = 3;
            break;
          }

          res.redirect('/');
          return _context.abrupt("return");

        case 3:
          // values for the slots from the form
          slotValues = {
            "Slot0": req.query.Slot1,
            "Slot1": req.query.Slot2,
            "Slot2": req.query.Slot3,
            "Slot3": req.query.Slot4,
            "Slot4": req.query.Slot5,
            "Slot5": req.query.Slot6,
            "Slot6": req.query.Slot7,
            "Slot7": req.query.Slot8,
            "Slot8": req.query.Slot9,
            "Slot9": req.query.Slot10
          }; // call the async function to update the values of the timeSlots table

          updateTimeSlots(slotValues).then(function () {
            // print the success message
            console.log("Successfully Updated ".concat(availTimeSlots, " Table")); // passing value to variable to let the admin-view show a success message

            updatedSlots = true;
            res.redirect('/DoodleAdmin');
            return;
          })["catch"](function (err) {
            throw err;
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}); //Quitting

router.get('/logout', function (req, res) {
  user = undefined;
  res.redirect('/');
  return;
});