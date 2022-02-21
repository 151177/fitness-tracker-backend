const express = require("express");
const activitiesRouter = express.Router();
const {
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db/index");
const { requireUser } = require("./utils");

activitiesRouter.use((req, res, next) => {
  console.log("A request is being made to /activities");
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
//todo figure out a better way to prevent two of the same activity being made
activitiesRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const newActivity = await createActivity(req.body);
    if (!newActivity) {
      return next({
        name: "InvalidActivity",
        message: "This activity already exists",
      });
    }
    res.send(newActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /activies/:activityId (*)
activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  try {
    //grabs original activity info
    const id = req.params.activityId;
    const oldActivity = await getActivityById(id);

    //setting updated info
    const { name, description } = req.body;
    const updates = {
      id: id,
      name: oldActivity.name,
      description: oldActivity.description,
    };

    if (name) {
      updates.name = name;
    }

    if (description) {
      updates.description = description;
    }

    const newActivity = await updateActivity(updates);
    res.send(newActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//todo GET /activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  try {
    const id = req.params.activityId;
    const routines = await getPublicRoutinesByActivity({ id });

    if (routines.length === 0) {
      return next({
        name: "NoRoutinesWithActivity",
        message: "There are no public routines with this activity",
      });
    }
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = activitiesRouter;
