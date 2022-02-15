const client = require("./client");

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
    INSERT INTO activities(name,description)
    VALUES($1,$2)
    RETURNING *;
    `,
      [lwrName, description]
    );
    return activity;
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
    return activity; // return the updated activity
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getActivityById: getActivityById,
  getAllActivities: getAllActivites,
  createActivity: createActivity,
  updateActivity: updateActivity,
};
