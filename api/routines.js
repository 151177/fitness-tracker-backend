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

module.exports = routineRouter;
