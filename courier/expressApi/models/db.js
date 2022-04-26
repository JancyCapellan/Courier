const mysql = require('mysql2')
const dbConfig = require('./db.config.js')

// Create a connection to the database
const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
})

// open the MySQL connection
connection.getConnection((error, connection) => {
  if (error) throw error
  console.log('Successfully connected to the mysql database.')
  if (connection) {
    connection.release()
  }
})

// to make async/await
// exports.getConnection = () => {
//   return new Promise((resolve, reject) => {
//     pool.getConnection(function (err, connection) {
//       if (err) {
//         return reject(err)
//       }
//       resolve(connection)
//     })
//   })
// }

//  somewhere.js
// const wrappingFunction = async () => {
//   const connection = await db.getConnection()
//   console.log(connection)
// }
// wrappingFunction()
module.exports = connection
