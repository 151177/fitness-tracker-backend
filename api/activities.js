const express = require("express");
const activitiesRouter = express.Router();
const {
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
} = require("../db/index");

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made /activities");
  next();
});

//GET /activities
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();
    res.send(allActivities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//todo POST /activities (*)

//todo PATCH /activies/:activityId (*)

//todo GET /activities/:activityId/routines
module.exports = activitiesRouter;
