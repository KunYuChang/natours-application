/**
 * todo 匯入資料到資料庫
 */

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

// 1) 使用環境變數
dotenv.config({ path: './config.env' });

// 2) 資料庫設定檔替換環境變數
const DB = process.env.DATABASE.replace('<USER>', process.env.USER)
  .replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  .replace('<DATABASE_NAME>', process.env.DATABASE_NAME);

// 3) 資料庫連線
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

// 4) 讀取檔案
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// 5) 資料導入資料庫
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// 6) 刪除資料庫全檔案
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// 7) 命令引數邏輯設定
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// 8) 執行命令 (在終端機執行)
// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete
