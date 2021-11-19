//accessing the database with async functions

const { createConnection, doodleTimeSlots, availTimeSlots  } = require('./DBTables')
const util = require('util');


//function to get row and column info of entries
async function getPageData()    {
    const conn = createConnection();

    conn.connect();

    let query = util.promisify(conn.query).bind(conn);

    let doodleTimeSlotEntries, availTimeSlotsEntries;

    try {
        doodleTimeSlotEntries = await query(`SELECT 
                                             *
                                             FROM 
                                             ${doodleTimeSlots};`);
        
        availTimeSlotsEntries = await query(`SELECT
                                             *
                                             FROM 
                                             ${availTimeSlots};
      `);
      
    }   catch (err) {
        console.log(err);
    }  finally {
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
    getPageData : getPageData,
    updateTimeSlots : updateTimeSlots
};