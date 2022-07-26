const requestIp = require("request-ip");
const DAO = require("../app/DAO");
const maxmind = require("maxmind");

//解析ip中间件
function IPMiddleware(ctx, next) {
  return (ctx, next) => {
    let ip = requestIp.getClientIp(ctx.request);
    if (ip) {
      ip = ip.replace("::ffff:", "");
    }
    ctx.clientIp = ip;
    return next();
  };
}

//根据ip创建访问者中间件
function VisitorMiddleware(ctx, next) {
  return async (ctx, next) => {
    console.log(ctx.clientIp);
    let res = await DAO.createVisitor({ ip: ctx.clientIp });
    // console.log(res[0].dataValues);
    // console.log(res[1]);
    return next();
  };
}

//文章访问计数
function ViewCountMiddleware(ctx, next) {
  return async (ctx, next) => {
    let { id } = ctx.request.query;
    let res = await DAO.addArticleViews(id);
    console.log(res);
    return next();
  };
}

function IpToAddressMiddleware(ctx, next) {
  maxmind.open("../database/GeoLite2-City.mmdb").then((lookup) => {
    console.log(lookup.get(ctx.clientIp).subdivisions);
    return next();
  });
}

module.exports = {
  IPMiddleware,
  VisitorMiddleware,
  ViewCountMiddleware,
  IpToAddressMiddleware,
};
