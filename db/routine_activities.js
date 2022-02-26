const client = require("./client");
// getRoutineActivityById
// getRoutineActivityById(id)
// return the routine_activity
async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
      SELECT * FROM routine_activities 
      WHERE id = $1
    `,
      [id]
    );
    return routineActivity;
  } catch (error) {
    throw error;
  }
}

// addActivityToRoutine
// create a new routine_activity, and return it
async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
      INSERT INTO routine_activities("routineId","activityId",count,duration)
      VALUES($1,$2,$3,$4)
      ON CONFLICT ("routineId", "activityId") DO NOTHING
      RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );
    if (!routineActivity) {
      throw new Error({
        name: "FailedToAddActivityToRoutine",
        message: "The activity could not be added to this routine",
      });
    }
    return routineActivity;
  } catch (error) {
    throw error;
  }
}

// updateRoutineActivity
// Find the routine_activity with id equal to the passed in id
// Update the count or duration as necessary
async function updateRoutineActivity({ id, ...updateFields }) {
  const setString = Object.keys(updateFields)
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(",");
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
    UPDATE routine_activities 
    SET ${setString}
    WHERE id = ${id}
    RETURNING *;
  `,
      Object.values(updateFields)
    );
    return routineActivity;
  } catch (error) {
    throw error;
  }
}

// destroyRoutineActivity
// remove routine_activity from database
async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
    SELECT * FROM routine_activities
    WHERE id = $1
    `,
      [id]
    );
    await client.query(
      `
      DELETE FROM routine_activities 
      WHERE id = $1;
    `,
      [id]
    );
    return routineActivity;
  } catch (error) {
    throw error;
  }
}

// getRoutineActivitiesByRoutine
// select and return an array of all routine_activity records
//what is this function used for?
async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routineActivity } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE "routineId" = $1;
  `,
      [id]
    );

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivitiesByRoutine,
};
