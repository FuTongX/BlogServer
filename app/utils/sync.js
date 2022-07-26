const seq = require("./seq");
require("../models");

//验证 连接
seq
  .authenticate()
  .then(() => {
    console.log("ok");
  })
  .catch(() => {
    console.log("eror");
  });

// 设为 true 会重新创建数据表
//同步模型到数据库 -> 建表
seq.sync({ alter: true }).then(() => {
  console.log("sync ok");
});
