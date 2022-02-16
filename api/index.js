// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require('express');
const apiRouter = express.Router();
const { } = require('../db');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;