const router = require("koa-router")();
const controller = require("../../controller/Blog");
const { ViewCountMiddleware } = require("../../../middleware");
router.prefix("/api/blog");
//home

// router.use((ctx,next)=>{
//   console.log('xxxxx');
//   return next();
// })

//文章列表
router.get("/article/list", controller.getArticleList);
router.get("/article", ViewCountMiddleware(), controller.getArticleById);

//轮播图列表
router.get("/article/carouselList", controller.getCarouseList);

router.get("/tagListWithArticleNum", controller.getTagListWithArticleNumber);

router.get(
  "/categoryListWithArticleNum",
  controller.getCategoryListWithArticleNumber
);

router.get("/articleListOrderByYear", controller.getArticleListOrderByYear);
router.get("/articleCount", controller.getArticleCount);
router.get("/articleStatistics", controller.getStatistics);

router.get("/wisdomList", controller.getWisdomList);

router.get("/userinfo", controller.getUserInfo);

//评价

router.post("/comment", controller.createComment);
router.get("/comment", controller.getCommentList);
module.exports = router;
