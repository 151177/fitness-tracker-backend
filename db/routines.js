const res = require("express/lib/response");
const client = require("./client");

const addActivitiesToRoutines = async (routines) => {
  try {
    const routineIdArray = routines.map((routine) => {
      return routine.id;
    });

    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities."routineId", routine_activities.id AS "routineActivityId"
      FROM activities
      JOIN routine_activities ON activities.id = routine_activities."activityId"
      WHERE routine_activities."routineId" IN (${routineIdArray});
    `);

    routines.forEach((routine) => {
      routine.activities = activities.filter(
        (activity) => routine.id === activity.routineId
      );
    });

    return routines;
  } catch (error) {
    next(error);
  }
};

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

    // if (!routine) {
    //   throw {
    //     name: "RoutineNotFoundError",
    //     message: "Could not find a routine with that routineId",
    //   };
    // }

    return routine;
  } catch (error) {
    throw error;
  }
}

// getRoutinesWithoutActivities
// select and return an array of all routines
async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
    SELECT * FROM routines 
    `);
    return routines;
  } catch (error) {
    throw error;
  }
}

// getAllRoutines
// select and return an array of all routines, include their activities
async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName" FROM routines
        JOIN users ON users.id = routines."creatorId";
      `
    );

    return await addActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

// getAllPublicRoutines "isPublic"
// select and return an array of public routines, include their activities
async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName" FROM routines
        JOIN users ON users.id = routines."creatorId"
        WHERE "isPublic" = true;
      `
    );

    return await addActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

// getAllRoutinesByUser
// getAllRoutinesByUser({ username })
// select and return an array of all routines made by user, include their activities
async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName" FROM routines
        JOIN users ON users.id = routines."creatorId"
        WHERE users.username = $1;
      `,
      [username]
    );

    return await addActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

// getPublicRoutinesByUser
// getPublicRoutinesByUser({ username })
// select and return an array of public routines made by user, include their activities
async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
        SELECT routines.*, users.username AS "creatorName" FROM routines
        JOIN users ON users.id = routines."creatorId"
        WHERE "isPublic" = true AND users.username = $1;
      `,
      [username]
    );

    return await addActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

// getPublicRoutinesByActivity
// getPublicRoutinesByActivity({ id })
// select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities
async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName" FROM routines 
      JOIN users ON users.id = "creatorId"
      JOIN routine_activities ON routine_activities."routineId" = routines.id
      WHERE "isPublic" = true AND routine_activities."activityId" = $1;
    `,
      [id]
    );

    return await addActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}

// createRoutine
// createRoutine({ creatorId, isPublic, name, goal })
// create and return the new routine
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
     INSERT INTO routines("creatorId", "isPublic", name, goal)
     VALUES($1,$2,$3,$4)
     RETURNING*;
  `,
      [creatorId, isPublic, name, goal]
    );

    if (!routine) {
      throw new Error({
        name: "FailedToCreateRoutine",
        message: "Your Routine was not created",
      });
    }

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
async function updateRoutine({ id, ...routineFields }) {
  const setString = Object.keys(routineFields)
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        UPDATE routines
        SET ${setString}
        WHERE id = ${id}
        RETURNING *;
      `,
      Object.values(routineFields)
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

// destroyRoutine
// destroyRoutine(id)
// remove routine from database
// Make sure to delete all the routine_activities whose routine is the one being deleted.
async function destroyRoutine(id) {
  try {
    await client.query(
      `
    DELETE FROM routine_activities
    WHERE "routineId" = $1
    `,
      [id]
    );

    const {
      rows: [destroyedRoutine],
    } = await client.query(
      `
    DELETE FROM routines
    WHERE id = $1
    RETURNING *;
    `,
      [id]
    );

    return destroyedRoutine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
