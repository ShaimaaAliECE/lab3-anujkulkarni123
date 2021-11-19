//accessing the database with async functions

const { createConnection, adminUsers, doodleTimeSlots, availTimeSlots  } = require('./DBTables')



const util = require('util');
const { query } = require('express');

//function to get row and column info of entries
async function getPageInfo()    {
    const conn = createConnection();

    conn.connect();

    conn.query = util.promisify(conn.query).bind(conn);

    let doodleTimeSlotEntries;
    let availTimeSlotsEntries;

    try {
        doodleTimeSlotEntries = await query(`SELECT 
                                             *
                                             FROM ${doodleTimeSlots};`)
        
        availTimeSlotsEntries = await query(`   SELECT
                                                *
                                                FROM ${availTimeSlots};
      `);
    }   finally {
        conn.end();

        return { doodleTimeSlotEntries: doodleTimeSlotEntries, availTimeSlotsEntries: availTimeSlotsEntries };
    }

}

async function updateTimeSlots(addedTimeSlots)  {
    const conn = createConnection();

    conn.connect();

    const query = util.promisify(conn.query).bind(conn);

    try {
        for (let i in addedTimeSlots) {
            if (addedTimeSlots[i])  {
                await query(`UPDATE ${availTimeSlots} SET
                                SlotValue = '${addedTimeSlots[i]}'
                             WHERE
                                SlotName = '${i}'`

                )
            }
        } 
    } finally {
        conn.end();
        return;
    }

}

module.exports = {
    getPageInfo : getPageInfo,
    updateTimeSlots : updateTimeSlots
};