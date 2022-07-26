const Sequelize = require("sequelize");
const seq = require("../utils/seq");

const Visitor = seq.define("visitor", {
  ip: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nickname: {
    type: Sequelize.STRING(32),
    defaultValue: "匿名者",
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  website: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  visits: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
    comment: "访问次数",
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    comment: "访客状态",
  },
});

module.exports = {
  Visitor,
};
