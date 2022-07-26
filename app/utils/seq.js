const { Sequelize } = require("sequelize");
const { MYSQL_CONFIG } = require("../../config/db");

const seq = new Sequelize(
  MYSQL_CONFIG.database,
  MYSQL_CONFIG.user,
  MYSQL_CONFIG.password,
  {
    host: MYSQL_CONFIG.host,
    dialect: "mysql",
    timezone: "+08:00", //东八时区
    pool: MYSQL_CONFIG.pool,
    logging: MYSQL_CONFIG.logging,
  }
);

module.exports = seq;
