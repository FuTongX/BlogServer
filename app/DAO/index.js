const models = require("../models/index");
const { Op } = require("sequelize");
const cryp = require("../utils/cryp");
const seq = require("../utils/seq");
const { ListToTree, GetTreeIdArray } = require("../utils/tools");

async function getUser(userName, password) {
  return await models.User.findOne({
    attributes: ["id", "nickName", "avatar", "github", "motto", "blogName"],
    where: {
      userName: userName,
      password: cryp.genPassword(password),
    },
  });
}

async function editUserInfo(userInfo) {
  return await models.User.update(
    {
      nickName: userInfo.nickName,
      avatar: userInfo.avatar,
      github: userInfo.github,
      motto: userInfo.motto,
      blogName: userInfo.blogName,
    },
    {
      where: {
        id: userInfo.id,
      },
    }
  );
}

//获取用户的信息
async function getUserInfo() {
  return await models.User.findOne({
    attributes: ["nickName", "avatar", "github", "motto", "blogName"],
  });
}

//谚语
async function getProverbList() {
  return await models.Proverb.findAll();
}

async function deleteProverbById(id) {
  return await models.Proverb.destroy({
    where: { id },
  });
}

async function createOneProverb(proverbObj) {
  return await models.Proverb.create({
    author: proverbObj.author,
    content: proverbObj.content,
  });
}

async function editOneProverb(proverbObj) {
  return await models.Proverb.update(
    {
      author: proverbObj.author,
      content: proverbObj.content,
    },
    {
      where: {
        id: proverbObj.id,
      },
    }
  );
}

//tag操作

/**
 * 通过id删除tag
 * @param {*} id
 * @returns
 */
async function deleteTag(id) {
  return await models.Tag.destroy({
    where: {
      id,
    },
  });
}

/**
 * 通过id修改tag
 * @param {*} id
 * @param {*} name
 * @returns
 */
async function editTag(id, name) {
  return await models.Tag.update(
    { name },
    {
      where: {
        id,
      },
    }
  );
}

/**
 * 如果未找name的tag，则创建一个tag
 * @param {*} name
 */
async function createTag(name) {
  return await models.Tag.findCreateFind({
    where: {
      name,
    },
  });
}

async function getCategoryList() {
  let { rows } = await models.Category.findAndCountAll();
  return rows.map((value) => {
    let { id, name, description, cover, isLeaf, parentId } = value.dataValues;
    return {
      id,
      name,
      description,
      cover,
      isLeaf,
      parentId,
    };
  });
}

async function getCategoryTree() {
  let list = await getCategoryList();
  return ListToTree(list);
}

async function getCategoryTreeNoLeaf() {
  let { rows } = await models.Category.findAndCountAll({
    where: {
      isLeaf: false,
    },
  });
  let list = rows.map((value) => {
    let { id, name, description, cover, isLeaf, parentId } = value.dataValues;
    return {
      id,
      name,
      description,
      cover,
      isLeaf,
      parentId,
    };
  });
  return ListToTree(list);
}

async function setCategory(categoryObj) {
  let {
    name,
    description = "",
    isLeaf,
    parentId = -1,
    cover = "",
  } = categoryObj;
  return await models.Category.create({
    description,
    cover,
    isLeaf,
    parentId,
    name,
  });
}

async function editCategoryById(categoryObj) {
  let { id, name, description, cover, parentId } = categoryObj;
  return await models.Category.update(
    { name, description, cover, parentId },
    {
      where: {
        id,
      },
    }
  );
}

async function deleteCategoryByIds(ids) {
  return await models.Category.destroy({
    where: {
      id: ids,
    },
  });
}

async function getCategoryById(id) {
  return await models.Category.findByPk(id);
}

async function getCategoryByName(name) {
  return await models.Category.findOne({
    where: {
      name,
    },
  });
}

async function addArticle(articleObj) {
  let {
    title,
    description,
    content,
    cover,
    category_id,
    createdAt,
    public,
    tags,
  } = articleObj;
  let newPost = await models.Article.create({
    title,
    description,
    cover,
    public,
    createdAt,
    content,
    category_id,
  });
  let tag = await models.Tag.findAll({
    where: {
      id: tags,
    },
  });
  return await newPost.setTags(tag);
}

async function getArticleList(searchObj) {
  return await models.Article.findAndCountAll({
    include: [
      {
        model: models.Tag,
      },
      {
        model: models.Category,
      },
    ],
    where: searchObj.whereObj,
    ...searchObj.pageInfo,
    distinct: true,
  });
}

//轮播
async function getCarouseList(pagesize) {
  return await models.Article.findAll({
    attributes: ["id", "title", "cover", "description", "createdAt"],
    order: [["views", "desc"]],
    limit: pagesize,
    distinct: true,
    where: {
      public: true,
    },
  });
}

//获取标签列表，要有使用了该标签的文章数目
async function getTagListWithArticleNumber() {
  return await seq.query(
    "SELECT tags.id, name ,count(articletag.articleId) as articleNumber FROM   tags left join articletag on myblog.tags.id = articletag.tagId group by tags.id"
  );
}

async function getCategoryListWithArticleNumber() {
  return await seq.query(
    "SELECT c.id,c.name,c.parentId,c.isLeaf,count(a.id) as articleCount   FROM categories as c left join articles as a on a.category_id = c.id group by c.id"
  );
}

async function getArticleListOrderByYear(pagesize, curpage) {
  return await models.Article.findAll({
    attributes: ["id", "title", "cover", "createdAt"],
    order: [["createdAt", "DESC"]],
    limit: pagesize,
    offset: pagesize * (curpage - 1),
  });
}

async function getArticleCount() {
  // return await seq.query(
  //   "SELECT count(a.id) as articleCount  FROM  articles as a "
  // );
  return await models.Article.count();
}

async function getTagCount() {
  return await models.Tag.count();
}

async function getCategoryCount() {
  return await models.Category.count({
    where: {
      isLeaf: true,
    },
  });
}

async function getArticleById(id) {
  return await models.Article.findByPk(id);
}

async function deleteArticleById(id) {
  return await models.Article.destroy({
    where: {
      id,
    },
  });
}

async function editArticle(articleObj) {
  let { id, title, description, content, cover, category_id, tags } =
    articleObj;
  console.log(category_id);
  let updatePost = await models.Article.update(
    {
      title,
      description,
      cover,
      content,
      category_id,
    },
    {
      where: {
        id,
      },
    }
  );
  if (tags) {
    let post = await models.Article.findByPk(id);
    let tag = await models.Tag.findAll({
      where: {
        id: tags,
      },
    });
    await post.setTags(tag);
  }

  return updatePost;
}

async function editArticlePublic(id, public) {
  return await models.Article.update(
    { public },
    {
      where: {
        id,
      },
    }
  );
}

async function addArticleViews(id) {
  return await seq.query(`update articles set views=views+1 where id = ${id} `);
}

//访问者
async function createVisitor(visitorObj) {
  let { ip } = visitorObj;
  return await models.Visitor.findCreateFind({
    where: {
      ip,
    },
  });
}

//评论

async function createComment(commentObj) {
  let { article_id, ip, content, parent_id = -1 } = commentObj;
  let visitor = await models.Visitor.findCreateFind({
    where: {
      ip,
    },
  });
  let visitor_id = visitor[0].dataValues.id;
  return await models.Comment.create({
    article_id,
    visitor_id,
    content,
    parent_id,
  });
}

async function getCommentList(article_id) {
  let whereObj = { parent_id: -1, state: true };
  if (article_id) {
    whereObj.article_id = article_id;
  }
  return await models.Comment.findAndCountAll({
    include: [
      {
        model: models.Visitor,
      },
      {
        model: models.Article,
        attributes: ["title"],
      },
    ],
    distinct: true,
    where: whereObj,
  });
}

async function CommentListAdmin(searchObj) {
  return await models.Comment.findAndCountAll({
    include: [
      {
        model: models.Visitor,
      },
      {
        model: models.Article,
        attributes: ["title"],
        where: searchObj.whereObj.keyword,
      },
    ],
    distinct: true,
    where: searchObj.whereObj.state,
    ...searchObj.pageInfo,
  });
}

async function deleteComment(id) {
  return await models.Comment.destroy({
    where: {
      id,
    },
  });
}

async function editComment(id, state) {
  return await models.Comment.update(
    { state },
    {
      where: {
        id,
      },
    }
  );
}

async function commentCount() {
  return await models.Comment.count();
}

//文章分类数目统计

//文章访问top10
async function getLastViewsArticletTop() {
  return await models.Article.findAll({
    attributes: ["title", "views"],
    order: [["views", "DESC"]],
    limit: 10,
  });
}

//近期评论
async function getLastCommentTop() {
  return await models.Comment.findAll({
    attributes: ["id", "content", "createdAt"],
    include: [
      {
        model: models.Visitor,
        attributes: ["ip"],
      },
      {
        model: models.Article,
        attributes: ["title"],
      },
    ],
    distinct: true,
    limit: 5,
    order: [["createdAt", "DESC"]],
  });
}
//近期文章
async function getLastCreatedArticletTop() {
  return await models.Article.findAll({
    attributes: ["title", "views", "createdAt"],
    include: [
      {
        model: models.Category,
        attributes: ["name"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });
}

//文章分类统计
async function getArticleCategory() {
  return await seq.query(
    "SELECT distinct  name,count(*) as value FROM myblog.categories as c inner join myblog.articles as a on  c.id = a.category_id group by c.id"
  );
}

async function getVisitorIp() {
  return await models.Visitor.findAll({
    attributes: ["ip"],
  });
}

module.exports = {
  getUser,
  editTag,
  createTag,
  deleteTag,
  getCategoryList,
  getCategoryTree,
  setCategory,
  getCategoryByName,
  getCategoryById,
  deleteCategoryByIds,
  editCategoryById,
  addArticle,
  getArticleList,
  getCategoryTreeNoLeaf,
  editArticlePublic,
  deleteArticleById,
  editArticle,
  getCarouseList,
  getTagListWithArticleNumber,
  getCategoryListWithArticleNumber,
  getArticleById,
  getArticleListOrderByYear,
  getArticleCount,
  getTagCount,
  getCategoryCount,
  editUserInfo,
  deleteProverbById,
  createOneProverb,
  editOneProverb,
  getProverbList,
  getUserInfo,
  createVisitor,
  createComment,
  getCommentList,
  addArticleViews,
  CommentListAdmin,
  deleteComment,
  editComment,
  commentCount,
  getLastViewsArticletTop,
  getLastCommentTop,
  getLastCreatedArticletTop,
  getArticleCategory,
  getVisitorIp,
};
