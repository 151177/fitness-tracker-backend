const express = require("express");
const routineRouter = express.Router();
const { requireUser } = require("./utils");
const {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
} = require("../db");

routineRouter.use((req, res, next) => {
  console.log("A request is being made to /routines");
  next();
});

// GET /routines
routineRouter.get("/", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send(routines);
  } catch (error) {
    next({
      name: "NoPublicRoutines",
      message: "Unable to get all public routines",
    });
  }
});

//POST /routines (*)
routineRouter.post("/", requireUser, async (req, res, next) => {
  try {
    const routineFields = {
      creatorId: req.user.id,
      isPublic: req.body.isPublic,
      name: req.body.name,
      goal: req.body.goal,
    };
    const newRoutine = await createRoutine(routineFields);
    res.send(newRoutine);
  } catch (error) {
    next({
      name: "FailedToPostRoutine",
      message: "This routine could not be posted",
    });
  }
});

module.exports = routineRouter;
