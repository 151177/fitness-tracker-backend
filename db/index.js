// require and re-export all files in this db directory (users, activities...)

// This is a place to create and export the client, as well as to import and re-export the functions from our other files above.

// If your module.exports from each of the other files is built as an object with keys equal to the function names, then when you require the file, we can use the spread operator(...) to both import and help build our export function simultaneously.

// module.exports = {
//     ...require('./users'), // adds key/values from users.js
//     ...require('./activities'), // adds key/values from activites.js
//     ...require('./routines'), // etc
//     ...require('./routine_activities') // etc
// }
// Then we can just import into our server / API using require('./db'), etc, rather than importing from the separate files.