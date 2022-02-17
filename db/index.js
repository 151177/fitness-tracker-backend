// require and re-export all files in this db directory (users, activities...)
const client = require("./client");
module.exports = {
  client,
  ...require("./users"), //adds key/values from users.js
  ...require("./activities"), //adds key/values from activities.js
  ...require("./routines"), //adds key/values from routines.js
  ...require("./routine_activities"), //adds key/values from routine_activities.js
};
