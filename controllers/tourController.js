const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // 1) 創立查詢
    // http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy
    const queryObj = { ...req.query };

    // 初階過濾
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 進階過濾
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // MongoDB 依過濾條件尋找資料
    const query = Tour.find(JSON.parse(queryStr));

    // 2) 執行查詢
    const tours = await query;

    // Mongoose 依過濾條件尋找資料 (作為參考)
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equlas('easy');

    // 3) 發送回應
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      statue: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // Tour.findById -- mongoose
    const tour = await Tour.findById(req.params.id);

    // Tour.findOne({ _id: req.params.id}) -- mongoDB

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      statue: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      statue: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    /**
     *  @param req.params.id - 路由引數值
     *  @param req.body - POST傳過來的值
     *  @param {Object} opts - Mongoose的功能設定
     *  @param {Boolean} opts.new - 返回更新值
     *  @param {Boolean} opts.runValidators - 開啟更新驗證
     */
    const opts = { new: true, runValidators: true };

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, opts);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    // 由於沒有要返回內容給用戶端，所以可以直接執行，而不用使用變數去接。
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
