const client = require("./client");

// getRoutineById
// getRoutineById(id)
// return the routine
async function getRoutineById(routineId) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT * FROM routines
        WHERE id = $1;
      `,
      [routineId]
    );

    if (!routine) {
      throw {
        name: "RoutineNotFoundError",
        message: "Could not find a routine with that routineId",
      };
    }

    return routine;
  } catch (error) {
    throw error;
  }
}

// getRoutinesWithoutActivities
// select and return an array of all routines

// getAllRoutines
// select and return an array of all routines, include their activities
async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

// getAllPublicRoutines "isPublic"
// select and return an array of public routines, include their activities
async function getOpenReports() {
  try {
    // first load all of the reports which are open
    const { rows: openReports } = await client.query(`
        SELECT * FROM reports
        WHERE "isOpen" = true;
      `);

    // then load the comments only for those reports, using a
    // WHERE "reportId" IN () clause
    const { rows: comments } = await client.query(`
        SELECT * FROM comments
        WHERE "reportId" IN (${openReports
          .map((report) => report.id)
          .join(",")});
      `);

    openReports.forEach((report) => {
      delete report.password;
      report.comments = comments.filter(({ reportId }) => {
        return reportId === report.id;
      });
      report.isExpired = Date.parse(report.expirationDate) < new Date();
    });

    // finally, return the reports
    return openReports;
  } catch (error) {
    throw error;
  }
}

// getAllRoutinesByUser
// getAllRoutinesByUser({ username })
// select and return an array of all routines made by user, include their activities

// getPublicRoutinesByUser
// getPublicRoutinesByUser({ username })
// select and return an array of public routines made by user, include their activities

// getPublicRoutinesByActivity
// getPublicRoutinesByActivity({ id })
// select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities

// createRoutine
// createRoutine({ creatorId, isPublic, name, goal })
// create and return the new routine

// updateRoutine
// updateRoutine({ id, isPublic, name, goal })
// Find the routine with id equal to the passed in id
// Don't update the routine id, but do update the isPublic status, name, or goal, as necessary
// Return the updated routine

// destroyRoutine
// destroyRoutine(id)
// remove routine from database
// Make sure to delete all the routine_activities whose routine is the one being deleted.

module.exports = {
  getRoutineById,
  getAllRoutines,
};
