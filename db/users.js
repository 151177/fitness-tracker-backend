const client = require("./client");
const bcrypt = require("bcrypt");

// createUser
// createUser({ username, password })
// make sure to hash the password before storing it to the database
async function createUser({ username, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const {
      rows: [user],
    } = await client.query(
      `
            INSERT INTO users(username, password) 
            VALUES($1, $2) 
            ON CONFLICT (username) DO NOTHING 
            RETURNING *;
        `,
      [username, hashedPassword]
    );

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

// getUser
// getUser({ username, password })
// this should be able to verify the password against the hashed password
async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordsMatch) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
}

// getUserById
// getUserById(id)
// select a user using the user's ID. Return the user object.
// do NOT return the password
async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE id = $1;
      `,
      [userId]
    );

    if (user === undefined) {
      return null;
    }

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

// getUserByUsername
// getUserByUsername(username)
// select a user using the user's username. Return the user object.
async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT * FROM users
        WHERE username = $1;
      `,
      [username]
    );

    if (user === undefined) {
      return null;
    }

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
