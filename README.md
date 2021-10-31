# natours-application

一個露營網站

## Architecture

- Classes
- MVC

## Folder

- routes : 設定路由
- controllers : 路由函式
- models : 資料庫綱要
- public : 靜態檔案
- utils : 共用函式
- dev-data : 開發資料

# Format

- Prettier
- ESLint

## Setting

- config.env
- .gitignore

## Tech Stack

- HTML
- CSS
- JavaScript
- Node
- Express
- MongoDB
- Mongoose

## Package

- [slugify](https://www.npmjs.com/package/slugify) : 協助處理資料空格轉換
- [morgan](https://www.npmjs.com/package/morgan) : LOG 程式執行的結果
- [validator](https://www.npmjs.com/package/validator) : 用於 mongoose 驗證
- [ndb](https://www.npmjs.com/package/ndb) : GoogleChromeLabs 所提供的除錯環境
- [win-node-env](https://www.npmjs.com/package/win-node-env) : 協助 Windows ENV. 設定上同 Mac
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) : 用於轉換密碼的雜湊演算法
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : 身份驗證(Authentication)
- [nodemailer](https://www.npmjs.com/package/nodemailer) : 發送 Email
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) : 限制來自同一 IP 的重複請求
- [helmet](https://www.npmjs.com/package/helmet) : 通過設置各種 HTTP Headers 來保護 Express Application
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize) : 清理用戶提供的數據以防止 MongoDB Injection
- [xss-clean](https://www.npmjs.com/package/xss-clean) : 轉換 HTML 標籤語法防止 XSS 攻擊
- [hpp](https://www.npmjs.com/package/hpp) : 防止 HTTP 參數污染攻擊

## Service

- [Postman](https://www.postman.com/)
- [mailtrap](https://mailtrap.io/)
