const Sequelize = require("sequelize");
const seq = require("../utils/seq");

const Category = seq.define("category", {
  name: {
    type: Sequelize.STRING(64),
    allowNull: false,
    unique: true,
  },
  description: {
    type: Sequelize.STRING,
    defaultValue: "",
    allowNull: false,
  },
  cover: {
    type: Sequelize.STRING,
    defaultValue: "",
    allowNull: false,
  },
  isLeaf:{
    type:Sequelize.BOOLEAN,
    defaultValue:true,
    allowNull:false
  },
  // level: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  //   defaultValue: 1,
  // },
  parentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: -1,
  },
  // ,
  // article_id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // }
});

module.exports = {
  Category,
};
