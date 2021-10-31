// app.js 主要是處理 Express 中介軟體相關功能
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

/////////////////////////////////////////////////////////////////////////////
// 1) ⭐全域中介軟體(Global Middleware)

// 設定安全HTTP標頭
app.use(helmet()); // 頭盔保護要放置於整個中介軟體堆疊的前端

// 開發日誌
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 限制請求數量
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60分鐘
  max: 100, // 最高100次請求
  message: 'Too many requests from this IP, please try agagin in an hour!',
});
app.use('/api', limiter);

// 設置資料解析, body parser 將資料解析到 req.body
app.use(express.json());

// 資料清洗 : 防止 NoSQL query injection
app.use(mongoSanitize());

// 資料清洗 : 防止 XSS
app.use(xss());

// 防止參數汙染攻擊
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// 設置靜態資料
app.use(express.static(`${__dirname}/public`));

// 測試中介軟體
app.use((req, res, next) => {
  console.log('Hello form the middleware ✋');
  req.requestTime = new Date().toISOString();
  next();
});

/////////////////////////////////////////////////////////////////////////////
// 2) ⭐路由(ROUTE)

// 匹配路由
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// 萬用路由
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
});
// .all 代表包含get, post等等都符合, * 路徑全部匹配
// next 傳入的參數如果是 Error Object，會直接跳過其他中介軟體到 Error Handle
// req.originalUrl 最初請求的url

// 錯誤處理路由
app.use(globalErrorHandler);
// 給四個參數 Express 會知道是一個 Error Handle Middleware

module.exports = app;
