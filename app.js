const Koa = require("koa");
const app = new Koa();

const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");

const JWT = require("koa-jwt");

const BlogAdmin = require("./app/routes/BlogAdmin");
const Blog = require("./app/routes/Blog");

const config = require("./config/config");
const compress = require("koa-compress");

const { IPMiddleware } = require("./middleware");
// const { UnauthorizedMessage } = require("./app/utils/resultMessage");

app.use(IPMiddleware());

//require('./app/utils/sync');

// error handler
onerror(app);

// app.use((ctx, next) => {
//   return next().catch((err) => {
//     if (err.status === 401) {
//       ctx.status = 401;
//       ctx.body = new UnauthorizedMessage(null, "授权过期,请重新登录");
//     } else {
//       throw err;
//     }
//   });
// });

const options = { threshold: 2048 };
app.use(compress(options));

app.use(
  JWT({
    secret: config.tokenSecret,
  }).unless({
    //不需要验证的白名单
    path: [/\/api\/v1\/login/, /\/api\/v1\/register/, /\/api\/blog\/*/],
  })
);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(BlogAdmin.routes(), BlogAdmin.allowedMethods());
app.use(Blog.routes(), Blog.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
