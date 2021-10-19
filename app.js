const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middleware

app.use(morgan('dev'));

// express.json() : Express 可以解讀 JSON String 轉成 JavaScript Object
app.use(express.json());

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

module.exports = app;
