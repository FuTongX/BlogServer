const StatusCode = require("./status");
class Message {
  constructor(status, msg) {
    this.meta = {
      msg,
      status,
    };
  }
}

class ResultMessage extends Message {
  constructor(state, data) {
    super(StatusCode[state].status, StatusCode[state].msg);
    if (data) {
      this.data = data;
    }
  }
}

//成功的返回信息 200
class SuccessMessage extends ResultMessage {
  constructor(data, msg) {
    super("OK", data);
    if (msg) {
      this.meta.msg = msg;
    }
  }
}

//错误的请求信息 400
class ErrorMessage extends ResultMessage {
  constructor(data, msg) {
    super("BAD_REQUEST");
    if (msg) {
      this.meta.msg = msg;
    }
  }
}

class UnauthorizedMessage extends ResultMessage{
  constructor(data, msg) {
    super("UNAUTHORIZED");
    if (msg) {
      this.meta.msg = msg;
    }
  }
}

class CreatedMessage extends ResultMessage {
  constructor(data, msg) {
    super("CREATED", data);
    if (msg) {
      this.meta.msg = msg;
    }
  }
}

class ServerErrorMessage extends ResultMessage {
  constructor(data, msg) {
    super("INTERNAL_SERVER_ERROR", data);
    if (process.env.NODE_ENV === "dev") {
      if (msg) {
        this.meta.msg = msg;
      }
    }
  }
}

class DeleteMessage extends ResultMessage {
  constructor(data, msg) {
    super("DELETED", data);
    if (msg) {
      this.meta.msg = msg;
    }
  }
}

module.exports = {
  ResultMessage,
  SuccessMessage,
  ErrorMessage,
  CreatedMessage,
  ServerErrorMessage,
  DeleteMessage,
  UnauthorizedMessage
};
