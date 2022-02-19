const client = require("./client");
// getRoutineActivityById
// getRoutineActivityById(id)
// return the routine_activity

// addActivityToRoutine
// addActivityToRoutine({ routineId, activityId, count, duration })
// create a new routine_activity, and return it
async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: routineActivity } = await client.query(
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
// updateRoutineActivity({ id, count, duration })
// Find the routine_activity with id equal to the passed in id
// Update the count or duration as necessary

// destroyRoutineActivity
// destroyRoutineActivity(id)
// remove routine_activity from database

// getRoutineActivitiesByRoutine
// getRoutineActivitiesByRoutine({ id })
// select and return an array of all routine_activity records
module.exports = {
  addActivityToRoutine,
};
