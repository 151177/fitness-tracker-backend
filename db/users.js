const express = require("express");
const usersRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// createUser
// createUser({ username, password })
// make sure to hash the password before storing it to the database
async function createUser({ id, username, password }) {
    try {
        const { rows } = await client.query(`
        INSERT INTO users(id, username, password) 
        VALUES($1, $2, $3) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [id, username, password]);

        return rows;
    } catch (error) {
        throw error;
    }
}

// getUser
// getUser({ username, password })
// this should be able to verify the password against the hashed password
async function getUser({ username, password }) {
    // try {
    //   const { rows } = await client.query(`
    //   SELECT * FROM users
    //   WHERE password = 
    // `);
    //   return rows;
    // } catch (error) {
    //   throw error;
    // }

    // if ( user === null) {
    //     return res.status(400).send("Cannot find user")
    // }
    // try {
    //     bcrypt.compare(req.body.password, user.password)
    // } catch {
    //     res.status(500).send()
    // }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
        });

        const { rows } = await client.query(`
            SELECT * FROM users
            WHERE password = hashedPassword;
      `, [user]);

        return user;
    } catch {
        throw error;
    }
}

// getUserById
// getUserById(id)
// select a user using the user's ID. Return the user object.
// do NOT return the password
async function getUserById(userId) {
    try {
        const { rows: [user] } = await client.query(`
        SELECT * FROM users
        WHERE id = $1;
      `, [userId]);

        if (user === undefined) {
            return null;
        }

        delete user.password
        return user;
    } catch (error) {
        throw error;
    }
};

// getUserByUsername
// getUserByUsername(username)
// select a user using the user's username. Return the user object.
async function getUserByUsername(username) {
    try {
        const { rows: [user] } = await client.query(`
        SELECT * FROM users
        WHERE username = $1;
      `, [username]);

        if (user === undefined) {
            return null;
        }

        return user;
    } catch (error) {
        throw error;
    }
};


module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
};