const Sequelize = require("sequelize");
const seq = require("../utils/seq");

const Comment = seq.define("comment", {
  article_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  parent_id: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  visitor_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING(1023),
    allowNull: false,
  },
  state: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    comment: "评论状态",
  },
});

module.exports = {
  Comment,
};
