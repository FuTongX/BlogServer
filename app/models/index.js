const seq = require("../utils/seq");

const { Article } = require("./article");
const { Category } = require("./category");
const { Tag } = require("./tag");
const { Comment } = require("./comment");
const { User } = require("./user");
const { Visitor } = require("./visitor");
const { Proverb } = require("./proverb");
//建立表的联系

// A.hasOne(B) 关联意味着 A 和 B 之间存在一对一的关系,外键在目标模型(B)中定义.

// A.belongsTo(B)关联意味着 A 和 B 之间存在一对一的关系,外键在源模型中定义(A).

// A.hasMany(B) 关联意味着 A 和 B 之间存在一对多关系,外键在目标模型(B)中定义.

// A.belongsToMany(B, { through: 'C' }) 关联意味着将表 C 用作联结表,在 A 和 B 之间存在多对多关系. 具有外键(例如,aId 和 bId). Sequelize 将自动创建此模型 C(除非已经存在),并在其上定义适当的外键.

// 注意：在上面的 belongsToMany 示例中,字符串('C')被传递给 through 参数. 在这种情况下,Sequelize 会自动使用该名称生成模型. 但是,如果已经定义了模型,也可以直接传递模型.

//评论与文章的联系
Comment.belongsTo(Article, {
  //创建外键 Comment.article_id -> Article.id
  foreignKey: "article_id",
});

Article.hasMany(Comment, {
  foreignKey: "article_id",
});

//评论与访问者的关系
Visitor.hasMany(Comment, {
  foreignKey: "visitor_id",
});

Comment.belongsTo(Visitor, {
  foreignKey: "visitor_id",
});

//标签与文章的联系
Article.belongsToMany(Tag, {
  through: "ArticleTag",
});

Tag.belongsToMany(Article, {
  through: "ArticleTag",
});

//分类与文章的联系
Article.belongsTo(Category, {
  foreignKey: "category_id",
});
Category.hasMany(Article, {
  foreignKey: "category_id",
});

module.exports = {
  Article,
  Category,
  Comment,
  Tag,
  User,
  Visitor,
  Proverb,
};
