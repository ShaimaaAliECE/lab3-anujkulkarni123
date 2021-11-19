"use strict";

//accessing the database with async functions
var _require = require('./DBTables'),
    createConnection = _require.createConnection,
    doodleTimeSlots = _require.doodleTimeSlots,
    availTimeSlots = _require.availTimeSlots;

var util = require('util'); //function to get row and column info of entries


function getPageData() {
  var conn, query, doodleTimeSlotEntries, availTimeSlotsEntries;
  return regeneratorRuntime.async(function getPageData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          conn = createConnection();
          conn.connect();
          query = util.promisify(conn.query).bind(conn);
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(query("SELECT \n                                             *\n                                             FROM \n                                             ".concat(doodleTimeSlots, ";")));

        case 6:
          doodleTimeSlotEntries = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(query("SELECT\n                                             *\n                                             FROM \n                                             ".concat(availTimeSlots, ";\n      ")));

        case 9:
          availTimeSlotsEntries = _context.sent;
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](3);
          console.log(_context.t0);

        case 15:
          _context.prev = 15;
          conn.end();
          return _context.abrupt("return", {
            doodleTimeSlotEntries: doodleTimeSlotEntries,
            availTimeSlotsEntries: availTimeSlotsEntries
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 12, 15, 19]]);
}

function updateTimeSlots(addedTimeSlots) {
  var conn, query, i;
  return regeneratorRuntime.async(function updateTimeSlots$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          conn = createConnection();
          conn.connect();
          query = util.promisify(conn.query).bind(conn);
          _context2.prev = 3;
          _context2.t0 = regeneratorRuntime.keys(addedTimeSlots);

        case 5:
          if ((_context2.t1 = _context2.t0()).done) {
            _context2.next = 12;
            break;
          }

          i = _context2.t1.value;

          if (!addedTimeSlots[i]) {
            _context2.next = 10;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(query("UPDATE ".concat(availTimeSlots, " SET\n                                SlotValue = '").concat(addedTimeSlots[i], "'\n                             WHERE\n                                SlotName = '").concat(i, "'")));

        case 10:
          _context2.next = 5;
          break;

        case 12:
          _context2.prev = 12;
          conn.end();
          return _context2.abrupt("return");

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3,, 12, 16]]);
}

module.exports = {
  getPageData: getPageData,
  updateTimeSlots: updateTimeSlots
};