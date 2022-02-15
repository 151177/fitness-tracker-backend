const { client } = require("./client");

async function getActivityById(id) {
  try {
    const { rows } = await client.query(`
    SELECT id FROM activites
    WHERE id = ${id};
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllActivites() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM activities
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createActivity({ name, description }) {
  try {
    const lwrName = name.toLowerCase();
    const {
      rows: [activity],
    } = await client.query(
      `
    INSERT INTO activites (name, description)
    VALUES($1,$2)
    ON CONFLICT (name, description) DO NOTHING
    RETURNING*;
    `,
      [lwrName, description]
    );
    return activity; // return the new activity
  } catch (error) {
    throw error;
  }
}

async function updateActivity({ id, name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(`
    UPDATE activites
    SET name = ${name}, description = ${description}
    WHERE id = ${id};
    RETURNING*
    `);
    return activity; // return the new activity
  } catch (error) {
    throw error;
  }
}
// don't try to update the id
// do update the name and description
// return the updated activity

module.exports = {
  getActivityById,
  getAllActivites,
  // createActivity,
  // updateActivity
};
