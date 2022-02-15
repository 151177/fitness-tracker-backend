// require and re-export all files in this db directory (users, activities...)
// module.exports = {
//   ...require("./activites"),
// };

const { createActivity } = require("./activities");

module.exports = { createActivity };
