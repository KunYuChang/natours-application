const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// 產生 JWT
// HSA 256 Encryption, 長度至少要32個字元 (越長越好)
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  // ❌ 以下這種寫法存在嚴重的資安漏洞，直接把req.body存入資料庫意味著如果使用者手動輸入內容，也會被存入。
  //const newUser = await User.create(req.body);

  // ✔️ 這種寫法限制要儲存的內容，提升了安全性。
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      tour: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  // 由於在userSchema已經將password設定為select:false，使用.select('+password')加回來
  const user = await User.findOne({ email }).select('+password');

  // 用一種比較模糊的方式來告知錯誤，換言之就是不明確告訴使用者是沒有email還是密碼錯誤，對於資安比較有利。
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password'), 401);
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) 獲得令牌與確認是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) 驗證令牌

  // 3) 檢查用戶是否仍然存在

  // 4) 在令牌發出後檢查用戶是否更改了密碼
  next();
});
