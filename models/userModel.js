const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // 不顯示密碼給使用者
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

/**
 * 👉 對密碼進行雜湊加密(hash encryption)
 * 👉 使用 bcrypt 雜湊加密演算法
 * 👉 使用非同步版本
 *
 * ✍️ bcrypt 能夠將一個字串做雜湊加密，其中有個參數叫 saltRounds 是在密碼學中的加鹽(salt)，加鹽的意思是在要加密的字串中加特定的字符，打亂原始的字符串，使其生成的散列結果產生變化，其參數越高加鹽次數多越安全相對的加密時間就越長。--引述自 andy6804tw
 *
 * ✍️ 該加多少鹽? bcrypt.hash第二個參數數值越大加鹽越多則越安全，其運算與電腦CPU有關係，預設值為10，2021年的今天電腦效能普遍不錯因此可以設定12來提升安全性，如果是過往可能要降8來維持電腦運作速度。 --引述自 Jonas Schmedtmann
 *
 */

userSchema.pre('save', async function (next) {
  // guard clause(看守子句) : 如果密碼沒有變更，就直接傳到下一個中介軟體。
  if (!this.isModified('password')) return next();

  // 密碼進行雜湊處理 (cost 12)
  this.password = await bcrypt.hash(this.password, 12);

  // 刪除 passwordConfirm 欄位，因為只是拿來驗證，不需要儲存到資料庫。
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // 為了避免timestamp比jwt晚產生，將時間減去1秒。
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // crypto.createHash()方法用於創建一個雜湊物件
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log(resetToken, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
