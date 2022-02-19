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
async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
          SELECT * FROM routines;
        `);

    return rows;
  } catch (error) {
    throw error;
  }
}

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
async function getAllPublicRoutines() {
  try {
    const { rows: publicRoutines } = await client.query(`
        SELECT * FROM routines
        WHERE "isPublic" = true
        RETURNING *;
      `);

    return publicRoutines;
  } catch (error) {
    throw error;
  }
}

// getAllRoutinesByUser
// getAllRoutinesByUser({ username })
// select and return an array of all routines made by user, include their activities

//TODO NUMS ROUTINE FUNCIONS BELOW
// getPublicRoutinesByUser
// getPublicRoutinesByUser({ username })
// select and return an array of public routines made by user, include their activities

// getPublicRoutinesByActivity
// getPublicRoutinesByActivity({ id })
// select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities

// createRoutine
// createRoutine({ creatorId, isPublic, name, goal })
// create and return the new routine
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: routine } = await client.query(
      `
  INSERT INTO routines("creatorId", "isPublic", name, goal)
  VALUES($1,$2,$3,$4)
  RETURNING*;
  `,
      [creatorId, isPublic, name, goal]
    );
    console.log("THIS IS MY ROUTINE", routine);
    return routine;
  } catch (error) {
    throw error;
  }
}

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
  getRoutinesWithoutActivities,
  getAllRoutines,
  createRoutine,
};
