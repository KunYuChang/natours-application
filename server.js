const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// 1) 環境變數
dotenv.config({ path: './config.env' });
// console.log(app.get('env'));
// console.log(process.env)

// 2) 連線資料庫
const DB = process.env.DATABASE.replace('<USER>', process.env.USER)
  .replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  .replace('<DATABASE_NAME>', process.env.DATABASE_NAME);

mongoose
  .connect(DB, {
    // 一些設定用來處理棄用警告
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!')); // console.log(con.connections);

// 5) 運行伺服器
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App running on port ${port}`));
