const express = require("express");
const routineActivitiesRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getRoutineActivityById,
  updateRoutineActivity,
  getRoutineById,
  destroyRoutineActivity,
} = require("../db/index");
const res = require("express/lib/response");

routineActivitiesRouter.use((req, res, next) => {
  console.log("A request is made to /routine_activities");
  next();
});

const checkOwner = async (userId, routineId) => {
  try {
    const routine = await getRoutineById(routineId);
    if (routine.creatorId != userId) {
      return next({
        name: "InvalidUser",
        message: "You are not the owner of this routine",
      });
    }
    return;
  } catch ({ name, message }) {
    next({ name, message });
  }
};

// PATCH /routine_activities/:routineActivityId (**)
// Update the count or duration on the routine activity
routineActivitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      const userId = req.user.id;
      const oldRoutineActivity = await getRoutineActivityById(
        routineActivityId
      );
      await checkOwner(userId, oldRoutineActivity.routineId);

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
      const userId = req.user.id;
      const oldRoutineActivity = await getRoutineActivityById(
        routineActivityId
      );
      await checkOwner(userId, oldRoutineActivity.routineId);
      const deletedRoutineActivity = await destroyRoutineActivity(
        routineActivityId
      );

      res.send(deletedRoutineActivity);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routineActivitiesRouter;
