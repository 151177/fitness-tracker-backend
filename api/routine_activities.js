const express = require("express");
const routineActivitiesRouter = express.Router();
const { requireUser, checkOwner } = require("./utils");
const {
  getRoutineActivityById,
  updateRoutineActivity,
  destroyRoutineActivity,
} = require("../db");

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
      const { routineActivityId } = req.params;
      const oldRoutineActivity = await getRoutineActivityById(
        routineActivityId
      );
      const authorization = await checkOwner(
        req.user.id,
        oldRoutineActivity.routineId
      );
      if (!authorization) {
        return next({
          name: "InvalidUser",
          message: "You are not the owner of this routine",
        });
      }
      const updates = {
        id: routineActivityId,
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
routineActivitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      const oldRoutineActivity = await getRoutineActivityById(
        routineActivityId
      );
      const authorization = await checkOwner(
        req.user.id,
        oldRoutineActivity.routineId
      );
      if (!authorization) {
        return next({
          name: "InvalidUser",
          message: "You are not the owner of this routine",
        });
      }
      const deletedRoutineActivity = await destroyRoutineActivity(
        routineActivityId
      );
      res.send(deletedRoutineActivity);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = routineActivitiesRouter;
