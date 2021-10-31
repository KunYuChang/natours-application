/* eslint-disable arrow-body-style */
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // 7) 執行查詢
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // 8) 發送回應
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // Tour.findById -- mongoose
  const tour = await Tour.findById(req.params.id).populate('reviews');

  // Tour.findOne({ _id: req.params.id}) -- mongoDB

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// 使用閉包 : createTour變數存的值是catchAsync函式裡面的函式(因為return)
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  /**
   *  @param req.params.id - 路由引數值
   *  @param req.body - POST傳過來的值
   *  @param {Object} opts - Mongoose的功能設定
   *  @param {Boolean} opts.new - 返回更新值
   *  @param {Boolean} opts.runValidators - 開啟更新驗證
   */
  const opts = { new: true, runValidators: true };

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, opts);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  // 由於沒有要返回內容給用戶端，所以可以直接執行，而不用使用變數去接。
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      // 匹配 : 平均分數高於4.5才符合
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      // 分組
      $group: {
        // 依據difficulty進行分組 (轉大寫)
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      // 排序 : 依據平均金額由低到高排序
      $sort: { avgPrice: 1 },
    },
    {
      // 匹配 : 不等於EASY才符合
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      // 拆分（unwind）可以將陣列中的每一個值分解為單獨的文檔
      $unwind: '$startDates',
    },
    {
      // 設置日期區間
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      // 統計每個月的旅遊量
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      // 新增月份欄位
      $addFields: { month: '$_id' },
    },
    {
      // 不顯示_id
      $project: {
        _id: 0,
      },
    },
    {
      // 排序高到低
      $sort: { numTourStarts: -1 },
    },
    {
      // 限制輸出的筆數
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
