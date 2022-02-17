const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
} = require("../db");

// POST /users/register
// Create a new user. Require username and password, and
// hash password before saving user to DB.
// Require all passwords to be at least 8 characters long.
usersRouter.post("/users/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    }

    if (password.length < 8) {
      next({
        name: "PasswordLengthError",
        message: "Please enter a password that is a minimum of 8 characters",
      });
    }

    const newUser = await createUser({
      username,
      password,
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "You've signed up! Now, let's checkout some Worq outs!",
      token,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// Throw errors for duplicate username, or password-too-short.

// POST /users/login
// Log in the user. Require username and password, and verify that plaintext login password
// matches the saved hashed password before returning a JSON Web Token.
usersRouter.post("/users/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      // create token & return to user
      const token = jwt.sign(user, JWT_SECRET);
      res.send({ message: "Welcome back!", token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// Keep the id and username in the token.

// GET /users/me (*)
// Send back the logged-in user's data if a valid token is supplied in the header.
usersRouter.get("/users/me", (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    req.token = token;
    next();
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
});

// GET /users/:username/routines
// Get a list of public routines for a particular user.

module.exports = usersRouter;
