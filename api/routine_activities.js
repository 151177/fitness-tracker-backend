const express = require("express");
const r_aRouter = express.Router();
const { requireUser } = require("./utils");
const { updateRoutineActivity } = require("../db/index");

r_aRouter.use((req, res, next) => {
  console.log("A request is made to /routine_activities");
  next();
});

// PATCH /routine_activities/:routineActivityId (**)
// Update the count or duration on the routine activity
//! NOT DONE
r_aRouter.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const id = req.params.routineActivityId;
  const { count, duration } = req.body;

  try {
    const updates = await updateRoutineActivity(id, req.body);
    console.log(updates);
    res.send("THESE ARE MY UPDATES", updates);
  } catch (error) {
    next(error);
  }
});

// DELETE /routine_activities/:routineActivityId (**)
// Remove an activity from a routine, use hard delete

module.exports = r_aRouter;
