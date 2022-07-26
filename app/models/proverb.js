const Sequelize = require("sequelize");
const seq = require("../utils/seq");

//创建谚语模型
const Proverb = seq.define("proverb", {
  author: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = {
  Proverb,
};
