const express = require("express");
const routineActivitiesRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getRoutineActivityById,
  updateRoutineActivity,
  getRoutineById,
} = require("../db/index");

routineActivitiesRouter.use((req, res, next) => {
  console.log("A request is made to /routine_activities");
  next();
});

// PATCH /routine_activities/:routineActivityId (**)
// Update the count or duration on the routine activity
routineActivitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const id = req.params.routineActivityId;
      const oldRoutineActivity = await getRoutineActivityById(id);
      const routine = await getRoutineById(oldRoutineActivity.routineId);
      if (routine.creatorId != req.user.id) {
        return next({
          name: "InvalidUser",
          message: "You are not the owner of this routine",
        });
      }
      const updates = {
        id: id,
        count: oldRoutineActivity.count,
        duration: oldRoutineActivity.duration,
      };

      const { count, duration } = req.body;

      if (count) {
        updates.count = count;
      }
      if (duration) {
        updates.duration = duration;
      }
      const updatedRoutineActivity = await updateRoutineActivity(updates);
      res.send(updatedRoutineActivity);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// DELETE /routine_activities/:routineActivityId (**)
// Remove an activity from a routine, use hard delete
//! IN PROGRESS
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
