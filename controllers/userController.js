const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  // 物件跑迴圈檢查每次的項目是否包含在allowedFields當中?如果有就把該項目存入newObj物件
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) 如果使用者傳送的更新的資料包含密碼則返回錯誤訊息
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) 過濾掉不想更新的欄位
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log(filteredBody);

  // 3) 更新資料
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * ✍️await user.save({ validateBeforeSave: false })用於將 resetToken 保存到數據庫。該字段不需要任何驗證，因為它是由 userModel.js 的 createPasswordResetToken 函數使用加密 npm 生成的。它是受信任的，用戶無法訪問此文件。
 *
 * ✍️但是在 updateMe 函數中，用戶可以在姓名和電子郵件中輸入任何內容。例如，用戶可以在沒有@ 符號的情況下輸入空白名稱和無效的電子郵件地址。在這種情況下，如果我們使用 關閉驗證validateBeforeSave: false，則用戶輸入的任何內容都將被保存。因此，應在將這些字段保存到數據庫之前對其進行驗證。
 *
 * ✍️您可能會問userSchema.pre('save', async function(next) {}用於此目的，但此架構函數僅適用於 create 和 save 方法，不適用於 update 方法。因此，在這種情況下，我們不能使用validateBeforeSave: false which 使數據庫接受來自用戶的無效字段。
 */

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
