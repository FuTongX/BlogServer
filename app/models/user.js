const Sequelize = require("sequelize");
const seq = require("../utils/seq");

//创建User模型 数据表名是users
const User = seq.define("user", {
  //id 会自动创建 为主键 自增
  userName: {
    type: Sequelize.STRING, //varchar(255)
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nickName: {
    type: Sequelize.STRING,
    comment: "昵称",
  },
  avatar: {
    type: Sequelize.STRING,
    defaultValue: "",
    comment: "头像",
  },
  github: {
    type: Sequelize.STRING,
    defaultValue: "",
    comment: "个人github地址",
  },
  motto: {
    type: Sequelize.STRING,
    defaultValue: "",
    comment: "座右铭",
  },
  blogName:{
    type: Sequelize.STRING,
    defaultValue: "我的博客",
    comment:"博客名字"
  }
  //自动创建: createAt updatedAt
});

module.exports = {
  User,
};
