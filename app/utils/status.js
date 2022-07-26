const StatusCode = {
  OK: {
    status: 200,
    msg: "请求成功",
  },
  CREATED: {
    status: 201,
    msg: "创建成功",
  },
  DELETED: {
    status: 204,
    msg: "删除成功",
  },
  BAD_REQUEST: {
    status: 400,
    msg: "请求的地址不存在或者包含不支持的参数",
  },
  UNAUTHORIZED: {
    status: 401,
    msg: "未授权",
  },
  FORBIDDEN: {
    status: 403,
    msg: "被禁止访问",
  },
  NOT_FOUND: {
    status: 404,
    msg: "请求的资源不存在",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    msg: "内部错误",
  },
};

module.exports = StatusCode;
