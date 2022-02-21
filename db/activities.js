const client = require("./client");

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(`
    SELECT * FROM activities
    WHERE id = ${id};
    `);
    return activity;
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  try {
    const { rows } = await client.query(`
    SELECT * FROM activities;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createActivity({ name, description }) {
  try {
    // const lwrName = name.toLowerCase();
    const {
      rows: [activity],
    } = await client.query(
      `
    INSERT INTO activities(name,description)
    VALUES($1,$2)
    ON CONFLICT (name) DO NOTHING 
    RETURNING *;
    `,
      [name, description]
    );
    return activity;
  } catch (error) {
    throw error;
  }
}

async function updateActivity({ id, ...updateFields }) {
  const setString = Object.keys(updateFields)
    .map((key, index) => `"${key}" = $${index + 1}`)
    .join(", ");

  try {
    const {
      rows: [updatedActivity],
    } = await client.query(
      `
    UPDATE activities
    SET ${setString}
    WHERE id = ${id}
    RETURNING*;
    `,
      Object.values(updateFields)
    );
    return updatedActivity; // return the updated activity
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getActivityById,
  getAllActivities,
  createActivity,
  updateActivity,
};
