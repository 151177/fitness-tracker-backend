const express = require("express");
const usersRouter = express.Router();
const { requireUser } = require("./utils.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const {
  createUser,
  getUser,
  getUserByUsername,
  getPublicRoutinesByUser,
} = require("../db");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

// POST /users/register
// Create a new user. Require username and password, and
// hash password before saving user to DB.
// Require all passwords to be at least 8 characters long.
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const _user = await getUserByUsername(username);
    if (_user) {
      return next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

    if (password.length < 8) {
      return next({
        name: "PasswordLengthError",
        message: "Please enter a password that is a minimum of 8 characters",
      });
    }

    const newUser = await createUser({
      username,
      password,
    });

    if (newUser) {
      // create token & return to user
      const token = jwt.sign(newUser, JWT_SECRET);
      res.send({
        user: newUser,
        message: `Thank You For Signing Up ${newUser.username}! `,
        token: token,
      });
    }
  } catch ({ name, message }) {
    next({
      name: "InvalidUserNameorPassword",
      message: "Please do not leave username or password fields blank",
    });
  }
});
// Throw errors for duplicate username, or password-too-short.

// POST /users/login
// Log in the user. Require username and password, and verify that plaintext login password
// matches the saved hashed password before returning a JSON Web Token.
usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    return next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser(req.body);
    if (user) {
      // create token & return to user
      const token = jwt.sign(user, JWT_SECRET);
      res.send({
        user: user,
        message: `Welcome back ${user.username}! `,
        token: token,
      });
    }
  } catch (error) {
    next({
      name: "IncorrectCredentialsError",
      message: "Username or password is incorrect",
    });
  }
});
// Keep the id and username in the token.

// GET /users/me (*)
// Send back the logged-in user's data if a valid token is supplied in the header.
usersRouter.get("/me", requireUser, (req, res, next) => {
  res.send(req.user);
});

// GET /users/:username/routines
// Get a list of public routines for a particular user.
usersRouter.get("/:username/routines", async (req, res, next) => {
  try {
    const user = req.params.username;
    const routines = await getPublicRoutinesByUser({ username: user });

    if (routines.length === 0) {
      return next({
        name: "NoPublicRoutinesByUser",
        message: "There are no public routines by this user",
      });
    }
    res.send(routines);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
