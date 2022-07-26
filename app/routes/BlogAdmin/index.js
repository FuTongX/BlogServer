const router = require("koa-router")();
const controller = require("../../controller/BlogAdmin");

router.prefix("/api/v1");

//登录
router.post("/login", controller.login);

//注册
// router.post('/register',controller.register);

router.put("/user", controller.editUserInfo);

//谚语 增删改
router.put("/proverb", controller.editOneProverb);
router.delete("/proverb", controller.deleteProverbById);
router.post("/proverb", controller.createOneProverb);
router.get("/proverb", controller.getProverbList);

//标签
router.get("/tag", controller.getTagList);
router.post("/tag", controller.setTag);
router.delete("/tag", controller.deleteTag);
router.put("/tag", controller.editTag);

//分类
router.get("/category", controller.getCategoryList);
router.post("/category", controller.setCategory);
router.delete("/category", controller.deleteCategory);
router.put("/category", controller.editCategory);

//文章
router.post("/article", controller.addArticle);
router.get("/article", controller.getArticleList);
router.delete("/article", controller.deleteArticle);
router.put("/article", controller.editArticle);

router.put("/articlepublic", controller.editArticlePublic);

//评论
router.get("/comment", controller.CommentListAdmin);
router.delete("/comment", controller.deleteComment);
router.put("/comment", controller.editComment);

//统计
router.get("/statistics", controller.getStatisticsData);

router.get("/lastviewsarticle", controller.getLastViewsArticletTop);
router.get("/lastcomment", controller.getLastCommentTop);
router.get("/lastcreatearticle", controller.getLastCreatedArticletTop);
router.get("/articlecategory", controller.getArticleCategory);
router.get("/visitor", controller.getVisitor);
module.exports = router;
