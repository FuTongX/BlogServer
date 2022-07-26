const env = process.env.NODE_ENV;
let MYSQL_CONFIG;

if (env === "dev") {
  MYSQL_CONFIG = {
    host: "127.0.0.1",
    port: 3306,
    user: "dev",
    password: "123abc",
    database: "myblog",
  };
} else {
  MYSQL_CONFIG = {
    host: "127.0.0.1",
    port: 3306,
    user: "dev",
    password: "123abc",
    database: "myblog",
    pool: {
      max: 10, //池中最大连接数量
      min: 1, //最小保持数量
      idle: 10000, //多久没有被使用，释放
    },
    logging: false,
  };
}

module.exports = {
  MYSQL_CONFIG,
};
