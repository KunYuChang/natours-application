/**
 * AppError
 * 為了減少Error.statusCode、Error.status以及設置isOperational的重覆性撰寫
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // 使用captureStackTrace方法加入自帶的錯誤資訊 (Node.js的功能)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
