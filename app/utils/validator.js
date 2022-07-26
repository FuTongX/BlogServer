const {
  ResultMessage,
  SuccessMessage,
  ErrorMessage,
  CreatedMessage,
  ServerErrorMessage,
} = require("./resultMessage");

const validator = require("validator");

function isEmptyString(str, ctx) {
  if (str.trim() === "") {
    ctx.body = new ErrorMessage(null, "参数不能为空");
    return true;
  }
  return false;
}

function isEmail(str, ctx) {
  if (!validator.isEmail(str)) {
    ctx.body = new ErrorMessage(null, "不合法的email格式");
    return false;
  }
  return true;
}



module.exports = {
  isEmptyString,
  isEmail,
};
