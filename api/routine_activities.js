const express = require("express");
const routineActivitiesRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getRoutineActivityById,
  updateRoutineActivity,
} = require("../db/index");

routineActivitiesRouter.use((req, res, next) => {
  console.log("A request is made to /routine_activities");
  next();
});

// PATCH /routine_activities/:routineActivityId (**)
// Update the count or duration on the routine activity
//! Uncomment once done with making POST /routines/:routineId/activities route
// routineActivitiesRouter.patch(
//   "/:routineActivityId",
//   requireUser,
//   async (req, res, next) => {
//     try {
//       const id = req.params.routineActivityId;
//       const { count, duration } = req.body;
//       const oldRoutineActivity = await getRoutineActivityById(id);
//       const updates = {
//         id: id,
//         count: oldRoutineActivity.count,
//         duration: oldRoutineActivity.duration,
//       };
//       if (!count) {
//         updates.count = count;
//       }
//       if (!duration) {
//         updates.duration = duration;
//       }
//       const updatedRoutineActivity = await updateRoutineActivity(updates);
//       console.log("THESE ARE MY UPDATES", updatedRoutineActivity);
//       res.send(updatedRoutineActivity);
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   }
// );

// DELETE /routine_activities/:routineActivityId (**)
// Remove an activity from a routine, use hard delete
//! Uncomment later
// routineActivitiesRouter.delete(
//   "/:routineActivityId",
//   requireUser,
//   async (req, res, next) => {
//     try {
//       res.send("Delete in Progress");
//     } catch (error) {
//       next(error);
//     }
//   }
// );

module.exports = routineActivitiesRouter;
