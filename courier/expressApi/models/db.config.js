module.exports = {
  HOST: 'localhost',
  USER: 'root',
  PASSWORD: 'Kevindurant35!',
  DB: 'courierdb',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
