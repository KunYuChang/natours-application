const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// express.json() : Express 可以解讀 JSON String 轉成 JavaScript Object
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello form the middleware ✋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTE

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/**
 * method all 代表 get, post...等等都符合
 * '*' 全部匹配
 * req.originalUrl 最初請求的url
 */
app.all('*', (req, res, next) => {
  /**
   * Global Error Handling Middleware
   * @param err - 傳入 Error Object 引數,Express 會跳過其他 Middleware 直接到 Error Handle
   */
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});

// 給四個參數 Express 會知道是一個 Error Handle Middleware
app.use(globalErrorHandler);

module.exports = app;
