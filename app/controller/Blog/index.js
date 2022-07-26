const models = require("../../models/index");
const { Op } = require("sequelize");
const {
  ResultMessage,
  SuccessMessage,
  ErrorMessage,
  CreatedMessage,
  ServerErrorMessage,
  DeleteMessage,
} = require("../../utils/resultMessage");
const { ListToTree } = require("../../utils/tools");
const DAO = require("../../DAO");
const isIP = require("validator/lib/isIP");
const { isPrivateIp } = require("../../utils/tools");
//文章列表
async function getArticleList(ctx, next) {
  try {
    let { keyword = "", curpage = 1, pagesize = 6 } = ctx.request.query;
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
      [Op.and]: [{ public: true }],
    };

    searchObj.whereObj = whereObj;
    let res = await DAO.getArticleList(searchObj);

    if (res) {
      let { count, rows } = res;

      //查询结果处理
      let articles = rows.map((value) => {
        let tagsObj = value.tags.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
          };
        });
        value.dataValues.tags = tagsObj;
        return value.dataValues;
      });

      ctx.body = new SuccessMessage(
        {
          totalpage: Math.ceil(count / pagesize),
          pagesize,
          curpage,
          articles,
        },
        "查询成功"
      );
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

//根据id查文章
async function getArticleById(ctx, next) {
  try {
    let { id } = ctx.request.query;
    let res = await DAO.getArticleById(id);
    if (res) {
      ctx.body = new SuccessMessage(
        {
          content: res,
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
//轮播图列表 根据views数目
async function getCarouseList(ctx, next) {
  try {
    let { pagesize = 3 } = ctx.request.query;
    pagesize = Number(pagesize);
    if (pagesize <= 0) {
      pagesize = 3;
    }
    let res = await DAO.getCarouseList(pagesize);
    if (res) {
      ctx.body = new SuccessMessage(
        {
          articles: res,
        },
        "查询成功"
      );
    }
  } catch (err) {
    console.log(err);
    ctx.body = new ServerErrorMessage(err);
  }
}

//获取tag列表带有文章数目
async function getTagListWithArticleNumber(ctx, next) {
  try {
    let res = await DAO.getTagListWithArticleNumber();

    if (res) {
      ctx.body = new SuccessMessage(
        {
          list: res[0],
        },
        "查询成功"
      );
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

//获取类别树，带有文章数目

async function getCategoryListWithArticleNumber(ctx, next) {
  try {
    let res = await DAO.getCategoryListWithArticleNumber();
    if (res[0]) {
      let tree = ListToTree(res[0]);
      ctx.body = new SuccessMessage(
        {
          list: tree,
        },
        "查询成功"
      );
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getArticleListOrderByYear(ctx, next) {
  try {
    let { curpage = 1, pagesize = 6 } = ctx.request.query;
    curpage = parseInt(curpage);
    pagesize = parseInt(pagesize);
    let res = await DAO.getArticleListOrderByYear(pagesize, curpage);

    let list = [];
    let count = await DAO.getArticleCount();
    console.log(count);
    if (curpage == 1) {
      list.push({
        content: `文章总览 - ${count}`,
        size: "large",
        type: "primary",
        color: "#49b1f5",
        nodeType: "title",
      });
    }

    let startYear = new Date(res[0].createdAt).getFullYear();
    list.push({
      content: startYear,
      size: "normal ",
      type: "warning",
      nodeType: "time",
    });
    list.push({
      nodeType: "blog",
      cover: res[0].cover,
      createdAt: res[0].createdAt,
      content: res[0].title,
      id: res[0].id,
    });

    for (let i = 1; i < res.length; i++) {
      let year = new Date(res[i].createdAt).getFullYear();
      if (year < startYear) {
        list.push({
          content: year,
          size: "normal ",
          type: "warning",
          nodeType: "time",
        });
        list.push({
          nodeType: "blog",
          cover: res[i].cover,
          createdAt: res[i].createdAt,
          content: res[i].title,
          id: res[i].id,
        });
        startYear = year;
      } else {
        list.push({
          nodeType: "blog",
          cover: res[i].cover,
          createdAt: res[i].createdAt,
          content: res[i].title,
          id: res[i].id,
        });
      }
    }
    ctx.body = new SuccessMessage(
      {
        list,
        pagesize,
        curpage,
        totalpage: Math.ceil(count / pagesize),
      },
      "查询成功"
    );
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getArticleCount(ctx, next) {
  try {
    let res = await DAO.getArticleCount();
    ctx.body = new SuccessMessage(
      {
        count: res,
      },
      "查询成功"
    );
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getStatistics(ctx, next) {
  try {
    let articleCount = await DAO.getArticleCount();
    let categoryCount = await DAO.getCategoryCount();
    let tagCount = await DAO.getTagCount();
    ctx.body = new SuccessMessage(
      {
        articleCount,
        categoryCount,
        tagCount,
      },
      "查询成功"
    );
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getWisdomList(ctx, next) {
  try {
    let res = await DAO.getProverbList();
    let list = [];

    if (res) {
      for (let i = 0; i < res.length; i++) {
        list.push({
          msg: res[i].content,
          time: 500,
        });
      }
      ctx.body = new SuccessMessage({ list }, "查询成功");
    } else {
      ctx.body = new ErrorMessage();
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getUserInfo(ctx, next) {
  try {
    let res = await DAO.getUserInfo();
    if (res) {
      ctx.body = new SuccessMessage(res, "查询成功");
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function createComment(ctx, next) {
  try {
    let { articleId, ip, content, parentId = -1 } = ctx.request.body;

    if (isIP(ip)) {
      if (!isPrivateIp(ctx.clientIp)) {
        ip = ctx.clientIp;
      }
    } else {
      ip = ctx.clientIp;
    }

    let obj = {
      article_id: articleId,
      ip,
      content,
      parent_id: parentId,
    };
    let res = await DAO.createComment(obj);
    if (res) {
      ctx.body = new CreatedMessage(null, res.msg);
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

async function getCommentList(ctx, next) {
  try {
    let { articleId } = ctx.request.query;
    console.log(articleId);
    let res = await DAO.getCommentList(articleId);
    let list = [];
    for (let i = 0; i < res.count; i++) {
      list.push({
        id: res.rows[i].id,
        content: res.rows[i].content,
        createDate: res.rows[i].createdAt,
        commentUser: {
          id: res.rows[i].visitor.id,
          nickName: res.rows[i].visitor.nickname,
        },
      });
    }
    if (res) {
      ctx.body = new SuccessMessage({
        list,
      });
    }
  } catch (err) {
    ctx.body = new ServerErrorMessage(err);
  }
}

module.exports = {
  getArticleList,
  getCarouseList,
  getTagListWithArticleNumber,
  getArticleById,
  getCategoryListWithArticleNumber,
  getArticleListOrderByYear,
  getArticleCount,
  getStatistics,
  getWisdomList,
  getUserInfo,
  createComment,
  getCommentList,
};
