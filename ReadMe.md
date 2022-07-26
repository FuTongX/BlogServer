# BlogServer

## 概述

这个是博客用户端(Blog 项目)和管理端(BlogAdmin)的共用服务器，，用了 koa2 框架，数据库是 MySQL。 对于数据库的增删改查和建表主要用 Sequlize。

1. 共用一个服务器前端项目怎么区分呢？

```js
//app/routes/Blog
router.prefix("/api/blog");

//app/routes/BlogAdmin
router.prefix("/api/v1");
```

2. BlogAdmin 要登陆，而 Blog 不用登录就能访问怎么办？

```js
//app.js
app.use(
  JWT({
    secret: config.tokenSecret,
  }).unless({
    //不需要验证的白名单
    //在这里排除就行了
    path: [/\/api\/v1\/login/, /\/api\/v1\/register/, /\/api\/blog\/*/],
  })
);
```

## 功能

### 1. Blog 项目

- 查看文章列表可以后端分页
- 轮播图列表
- 查询指定文章
- 获取标签分类列表
- 创建评论
- 获取评论列表
- 获取用户信息和一些统计信息

### 2. BlogAdmin 项目

- JWT 登录
- 添加类别、标签及修改删除
- 添加文章及修改删除
- 管理查看评论(暂实现了一级评论,也就是不能对评论再评论...)
- 获取文章统计信息

## 项目目录结构

```
--- app  项目源码
    --- controller
        --- Blog       博客用户端的业务逻辑
        --- BlogAdmin  博客管理端业务逻辑
    --- DAO            数据库访问
    --- models         sequlize定义的模型
    --- routes
        --- Blog       博客用户端的路由
        --- BlogAdmin  博客管理端的路由
    --- utils          工具
        --- sync.js    该文件用于sequlize的连接测试和同步模型到数据库(建表)整个项目运行时要先运行一次
--- bin
--- config
    --- db.js          数据库相关配置
--- database           GeoLite数据库用来根据ip查地址用maxmind库解析
--- middleware         一些中间件比如ip地址解析
--- app.js             项目入口在这里配置全局中间件 比如JWT
```

## 如何安装

### 1. 配置 MYSQL 数据库

- 先安装好 mysql 数据库运行起来
- config/db.js 配置数据库信息
- 创建一个 myblog 库

### 2. 运行项目

- 安装好 nodejs 推荐用 nvm 安装
- npm install 安装依赖
- npm run dev 开启服务器
- 使用 sequlize 自动创建表（解开 app.js 中的 require('./app/utils/sync');)会自动创建
- 然后可以搭建 Blog 和 BlogAdmin 了
- 创建管理员用户

```js
// BlogServer/app/routes/BlogAdmin 目录
//注册
router.post('/register',controller.register); //解开这行
用postman工具向 http://127.0.0.1:4000/api/v1/register
发一个post请求
{
"userName":"xxx",
"password":"xxx",
"nickName":"xxx"
}
//记得注释上...
```
