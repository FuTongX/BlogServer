const Sequelize = require("sequelize");
const seq = require("../utils/seq");

const Article = seq.define("article", {
  //id 会自动创建 为主键 自增
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: "标题",
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: "内容",
  },
  cover: {
    type: Sequelize.STRING(255),
    defaultValue: "",
    comment: "图片",
  },
  description: {
    type: Sequelize.STRING(255),
    allowNull: false,
    defaultValue: "",
    comment: "简短描述",
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0, //0:未分类
    comment: "分类id",
  },
  // tag_id:{
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  //   comment:'标签id'
  // },
  // comment_id:{
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  //   comment:'评论id'
  // },
  author: {
    type: Sequelize.STRING,
    defaultValue: "佚名",
    comment: "作者名",
  },
  public: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false, //false不公开 true:公开
    comment: "是否公开",
  },
  star: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "点赞数",
  },
  views: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "阅读数",
  },
});

module.exports = {
  Article,
};
