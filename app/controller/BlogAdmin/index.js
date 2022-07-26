const jsonwebtoken = require("jsonwebtoken");
const config = require("../../../config/config");
const maxmind = require("maxmind");
const models = require("../../models/index");
const { Op } = require("sequelize");
const path = require("path");

const {
  ResultMessage,
  SuccessMessage,
  ErrorMessage,
  CreatedMessage,
  ServerErrorMessage,
  DeleteMessage,
} = require("../../utils/resultMessage");
const { isEmptyString } = require("../../utils/validator");
const { ListToTree, GetSubStreeIds } = require("../../utils/tools");
const DAO = require("../../DAO");

//处理业务
/**
 * 登录功能
 * @param {*} ctx
 * @param {*} next
 */
async function login(ctx, next) {
  try {
    const { userName, password } = ctx.request.body;
    let res = await DAO.getUser(userName, password);
    if (res) {
      let payload = {
        userinfo: {
          id: res.dataValues.id,
          nickName: res.dataValues.nickName,
          avatar: res.dataValues.avatar,
          github: res.dataValues.github,
          motto: res.dataValues.motto,
          blogName: res.dataValues.blogName,
        },
      };
      const token = jsonwebtoken.sign(payload, config.tokenSecret, {
        expiresIn: "5h",
      });

      ctx.body = new SuccessMessage({ token }, "登录成功");
    } else {
      ctx.body = new ErrorMessage(null, "登录失败");
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

/**
 * 注册功能
 * @param {*} ctx
 * @param {*} next
 */
async function register(ctx, next) {
  try {
    models.User.create({
      userName: "abcd",
      password: cryp.genPassword("1234abcd"),
      nickName: "小明",
    });
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function editUserInfo(ctx, next) {
  try {
    let res = await DAO.editUserInfo(ctx.request.body);
    if (res[0]) {
      ctx.body = new SuccessMessage(null, "修改成功");
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

//谚语
async function getProverbList(ctx, next) {
  try {
    let res = await DAO.getProverbList();

    if (res) {
      ctx.body = new SuccessMessage({ list: res }, "查询成功");
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function deleteProverbById(ctx, next) {
  try {
    let { id } = ctx.request.body;
    let res = await DAO.deleteProverbById(parseInt(id));
    if (res) {
      ctx.body = new DeleteMessage();
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function createOneProverb(ctx, next) {
  try {
    let { author, content } = ctx.request.body;
    let res = await DAO.createOneProverb({ author, content });
    if (res) {
      ctx.body = new CreatedMessage();
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function editOneProverb(ctx, next) {
  try {
    let { id, author, content } = ctx.request.body;
    let res = await DAO.editOneProverb({ id, author, content });
    if (res) {
      ctx.body = new SuccessMessage(null, "修改成功");
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

/**
 * 获取tag列表
 * @param {*} ctx
 * @param {*} next
 */
async function getTagList(ctx, next) {
  try {
    let res = await models.Tag.findAndCountAll();
    if (res) {
      let { count, rows } = res;
      let list = rows.map((value) => {
        let { id, name } = value.dataValues;
        return {
          id,
          name,
        };
      });
      ctx.body = new SuccessMessage(
        {
          count,
          list,
        },
        "查询成功"
      );
    } else {
      ctx.body = new ErrorMessage(null, "查询错误");
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

/**
 * 设置tag
 * json参数
 * {
 *  name:'tag'
 * }
 * @param {*} ctx
 * @param {*} next
 */
async function setTag(ctx, next) {
  try {
    let { name } = ctx.request.body;
    if (isEmptyString(name, ctx)) {
      return;
    }
    let res = await DAO.createTag(name);
    if (res[1]) {
      let { id, name } = res[0].dataValues;
      //插入值
      ctx.body = new CreatedMessage({
        id,
        name,
      });
    } else {
      //查找到值
      ctx.body = new ErrorMessage(null, "已有此标签");
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function deleteTag(ctx, next) {
  try {
    let { id } = ctx.request.body;
    let res = await DAO.deleteTag(id);
    ctx.body = new DeleteMessage();
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function editTag(ctx, next) {
  try {
    let { id, name } = ctx.request.body;
    let res = await DAO.editTag(id, name);
    if (res) {
      ctx.body = new SuccessMessage(null, "修改成功");
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getCategoryList(ctx, next) {
  try {
    const { hasLeaf } = ctx.request.query;
    let list = [];
    if (!hasLeaf || hasLeaf == "true") {
      list = await DAO.getCategoryTree();
    } else {
      list = await DAO.getCategoryTreeNoLeaf();
    }
    ctx.body = new SuccessMessage(
      {
        list,
      },
      "查询成功"
    );
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function setCategory(ctx, next) {
  try {
    let { name, parentId } = ctx.request.body;
    //判断name不为空串
    if (isEmptyString(name, ctx)) {
      return;
    }
    //判断name是否存在 存在会抛出异常
    await DAO.getCategoryByName(name);

    //设置值
    let res = await DAO.setCategory(ctx.request.body);
    if (res) {
      let { id, name, description, cover, isLeaf, parentId } = res.dataValues;
      //插入值
      ctx.body = new CreatedMessage({
        id,
        name,
        description,
        cover,
        isLeaf,
        parentId,
      });
    }
  } catch (err) {
    if (err.name == "SequelizeUniqueConstraintError") {
      ctx.body = new ErrorMessage(null, "已有此标签");
    } else {
      ctx.body = new ServerErrorMessage(err);
    }
  }
}

async function deleteCategory(ctx, next) {
  try {
    let { id } = ctx.request.body;
    let tree = await DAO.getCategoryTree();
    let deleteIds = GetSubStreeIds(tree, id);
    let res = await DAO.deleteCategoryByIds(deleteIds);
    if (res) {
      ctx.body = new DeleteMessage();
    } else {
      ctx.body = new ErrorMessage(null, "删除失败");
    }
  } catch (err) {
    if (err.name == "SequelizeForeignKeyConstraintError") {
      ctx.body = new ServerErrorMessage(
        null,
        "该类别已经被文章引用不能直接删除"
      );
    } else {
      ctx.body = new ServerErrorMessage(err);
    }
  }
}

async function editCategory(ctx, next) {
  try {
    let { id, name, description, cover, parentId } = ctx.request.body;

    // //获取当前类型节点及子节点id数组
    let tree = await DAO.getCategoryTree();
    let ids = GetSubStreeIds(tree, id);
    if (ids.indexOf(parentId) != -1) {
      ctx.body = new ErrorMessage(null, "父节点设置错误");
      return;
    }
    let res = await DAO.editCategoryById(ctx.request.body);
    if (res) {
      ctx.body = new SuccessMessage(null, "修改成功");
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function addArticle(ctx, next) {
  try {
    await DAO.addArticle(ctx.request.body);
    ctx.body = new CreatedMessage(null, "添加文章成功");
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

/**
 * 查询文章列表
 * @param {*} ctx
 * @param {*} next
 */
async function getArticleList(ctx, next) {
  try {
    let {
      keyword = "",
      pagesize = 6,
      curpage = 1,
      public = "all",
      category_id,
      tags,
    } = ctx.request.query;

    //tag数组
    if (tags) {
      tags = tags.split(",").map((tag) => {
        return parseInt(tag);
      });
    }

    let tagsSet = new Set(tags);

    let searchObj = {};

    //分页
    pagesize = Number(pagesize);
    curpage = Number(curpage);
    if (curpage < 1) {
      curpage = 1;
    }
    if (pagesize <= 0) {
      pagesize = 6;
    }
    let pageInfo = {
      limit: pagesize,
      offset: (curpage - 1) * pagesize,
    };
    searchObj.pageInfo = pageInfo;

    //查询条件
    //查询是否公开
    let publicObj = {};

    if (public != "all") {
      if (public == "true") {
        publicObj.public = true;
      } else {
        publicObj.public = false;
      }
    }
    //查询类型
    let categoryObj = {};
    if (!category_id || category_id != -1) {
      categoryObj.category_id = category_id;
    }

    let whereObj = {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${keyword}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
      [Op.and]: [publicObj, categoryObj],
    };

    searchObj.whereObj = whereObj;

    //关联查询+限制条件
    let res = await DAO.getArticleList(searchObj);
    if (res) {
      let { rows } = res;
      //查询结果处理
      let list = rows.map((value) => {
        let tagsObj = value.tags.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
          };
        });
        value.dataValues.tags = tagsObj;
        return value.dataValues;
      });

      //tag过滤
      if (tags && tags.length > 0) {
        list = list.filter((value) => {
          //每篇文章的tag数组
          let tagarr = [];
          for (let i = 0; i < value.tags.length; i++) {
            tagarr.push(value.tags[i].id);
          }
          let hasTag = () => {
            let i = 0;
            for (; i < tagarr.length; i++) {
              if (tagsSet.has(tagarr[i])) {
                return true;
              }
            }
            if (i == tagarr.length) {
              return false;
            }
          };
          return hasTag();
        });
      }

      ctx.body = new SuccessMessage(
        {
          count: res.count,
          list,
        },
        "查询成功"
      );
    } else {
      ctx.body = new ErrorMessage(null, "查询错误");
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function editArticlePublic(ctx, next) {
  try {
    let { id, public } = ctx.request.body;
    let res = await DAO.editArticlePublic(id, public);
    if (res[0]) {
      ctx.body = new SuccessMessage(null, "修改成功");
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function editArticle(ctx, next) {
  try {
    let res = await DAO.editArticle(ctx.request.body);

    if (res[0]) {
      ctx.body = new SuccessMessage(null, "修改成功");
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function deleteArticle(ctx, next) {
  try {
    let { id } = ctx.request.body;

    let res = await DAO.deleteArticleById(id);
    if (res) {
      ctx.body = new DeleteMessage();
    } else {
      ctx.body = new ErrorMessage(null, "删除失败");
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function CommentListAdmin(ctx, next) {
  try {
    let { keyword, state, pagesize = 5, curpage = 1 } = ctx.request.query;
    let searchObj = {
      whereObj: {},
      pageInfo: {
        limit: parseInt(pagesize),
        offset: pagesize * (curpage - 1),
      },
    };
    if (keyword) {
      searchObj.whereObj.keyword = {
        title: {
          [Op.like]: `%${keyword}%`,
        },
      };
    }
    if (state && state !== "all") {
      if (state == "true") {
        searchObj.whereObj.state = { state: true };
      } else {
        searchObj.whereObj.state = { state: false };
      }
    }
    let res = await DAO.CommentListAdmin(searchObj);
    if (res) {
      ctx.body = new SuccessMessage(
        {
          count: res.count,
          list: res.rows,
        },
        "查询成功"
      );
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function deleteComment(ctx, next) {
  try {
    let { id } = ctx.request.body;

    let res = await DAO.deleteComment(id);
    if (res) {
      ctx.body = new DeleteMessage();
    } else {
      ctx.body = new ErrorMessage(null, "删除失败");
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function editComment(ctx, next) {
  try {
    let { id, state } = ctx.request.body;
    let res = await DAO.editComment(id, state);
    if (res[0]) {
      ctx.body = new SuccessMessage(null, "修改成功");
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getStatisticsData(ctx, next) {
  try {
    let articleCount = await DAO.getArticleCount();
    let categoryCount = await DAO.getCategoryCount();
    let tagCount = await DAO.getTagCount();
    let commentCount = await DAO.commentCount();
    ctx.body = new SuccessMessage(
      {
        articleCount,
        categoryCount,
        tagCount,
        commentCount,
      },
      "查询成功"
    );
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getLastViewsArticletTop(ctx, next) {
  try {
    let res = await DAO.getLastViewsArticletTop();

    if (res) {
      ctx.body = new SuccessMessage({
        list: res,
      });
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getLastCommentTop(ctx, next) {
  try {
    let res = await DAO.getLastCommentTop();
    if (res) {
      ctx.body = new SuccessMessage({
        list: res,
      });
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getLastCreatedArticletTop(ctx, next) {
  try {
    let res = await DAO.getLastCreatedArticletTop();
    if (res) {
      ctx.body = new SuccessMessage({
        list: res,
      });
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getArticleCategory(ctx, next) {
  try {
    let res = await DAO.getArticleCategory();
    if (res) {
      ctx.body = new SuccessMessage({
        list: res[0],
      });
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getVisitor(ctx, next) {
  try {
    let res = await DAO.getVisitorIp();
    if (res) {
      let map = new Map();
      let lookup = await maxmind.open(
        path.join(__dirname, "../../../database/GeoLite2-City.mmdb")
      );

      for (let i = 0; i < res.length; i++) {
        let addr = lookup.get(res[i].ip);
        let city = addr.city.names["zh-CN"];
        if (map.has(city)) {
          map.set(city, map.get(city) + 1);
        } else {
          map.set(city, 1);
        }
      }
      let list = [];
      map.forEach((value, key) => {
        list.push({ name: key, value });
      });
      ctx.body = new SuccessMessage({
        list,
      });
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

module.exports = {
  login,
  register,
  getTagList,
  setTag,
  deleteTag,
  editTag,
  getCategoryList,
  setCategory,
  addArticle,
  getArticleList,
  deleteCategory,
  editCategory,
  editArticlePublic,
  deleteArticle,
  editArticle,
  editUserInfo,
  deleteProverbById,
  createOneProverb,
  editOneProverb,
  getProverbList,
  CommentListAdmin,
  deleteComment,
  editComment,
  getStatisticsData,
  getLastViewsArticletTop,
  getLastCommentTop,
  getLastCreatedArticletTop,
  getArticleCategory,
  getVisitor,
};
