const express = require("express");
const activitiesRouter = express.Router();
const {
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
} = require("../db/index");
const { requireUser } = require("./utils");

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made /activities");
  next();
});

//GET /activities
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();
    res.send(allActivities);
  } catch (error) {
    next(error);
  }
});

//todo POST /activities (*)
//! would not currently work until we have a user logged in
activitiesRouter.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const newActivity = createActivity(name, description);
    res.send(newActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//todo PATCH /activies/:activityId (*)

//todo GET /activities/:activityId/routines
module.exports = activitiesRouter;
