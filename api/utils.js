const { getRoutineById } = require("../db");

// checks to see if a user is logged in
function requireUser(req, res, next) {
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
}

// function to check owner of routine
async function checkOwner(userId, routineId) {
  try {
    const routine = await getRoutineById(routineId);
    return routine.creatorId === userId;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  requireUser,
  checkOwner,
};
