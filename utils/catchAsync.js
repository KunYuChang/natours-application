/**
 * catchAsync
 * 為了減少async/await當中的try/catch重覆使用，運用async回傳promise的特點用串接catch的方法來獲得錯誤訊息。
 */

// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
