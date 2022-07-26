const Sequelize=require('sequelize');
const seq = require('../utils/seq');

const Tag=seq.define('tag',{
    name: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique:true
      }
})

module.exports = {
    Tag
  }