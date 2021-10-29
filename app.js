// app.js 主要是處理 Express 中介軟體相關功能
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

/////////////////////////////////////////////////////////////////////////////
// 1) ⭐全域中介軟體(Global Middleware)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60分鐘
  max: 100, // 最高100次請求
  message: 'Too many requests from this IP, please try agagin in an hour!',
});
app.use('/api', limiter);

app.use(express.json()); // JSON String -> JS Object
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello form the middleware ✋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/////////////////////////////////////////////////////////////////////////////
// 2) ⭐路由(ROUTE)

// 匹配路由
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 萬用路由
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404); // req.originalUrl 最初請求的url
});
// .all 代表包含get, post等等都符合, * 路徑全部匹配
// next 傳入的參數如果是 Error Object，會直接跳過其他中介軟體到 Error Handle

// 錯誤處理路由
app.use(globalErrorHandler);
// 給四個參數 Express 會知道是一個 Error Handle Middleware

module.exports = app;
