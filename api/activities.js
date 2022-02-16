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

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();
    res.send({
      activities: allActivities,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = activitiesRouter;
