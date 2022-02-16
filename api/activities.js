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

// POST /activities (*)
//! CURRENT ROUTE DOES NOT REQUIRE USER AUTHENTICATION
// activitiesRouter.post("/", requireUser, async (req, res, next) => {
activitiesRouter.post("/", async (req, res, next) => {
  try {
    const newActivity = await createActivity(req.body);
    console.log(newActivity);
    res.send(newActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//todo PATCH /activies/:activityId (*)
activitiesRouter.patch("/:activityId", async (req, res, next) => {
  try {
    //grabs original activity info
    const id = req.params.activityId;
    const oldActivity = await getActivityById(id);

    //setting updated info
    const { name, description } = req.body;
    const updateFields = {};
    updateFields.id = id;

    if (name) {
      updateFields.name = name;
    } else {
      updateFields.name = oldActivity.name;
    }

    if (description) {
      updateFields.description = description;
    } else {
      updateFields.description = oldActivity.description;
    }

    const newActivity = await updateActivity(updateFields);
    res.send(newActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
//todo GET /activities/:activityId/routines
module.exports = activitiesRouter;
