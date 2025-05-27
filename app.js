// // app.js
// const express = require('express');
// const { getAllDessert } = require('./dbMysql12');

// const app = express();
// const port = 3000;

// app.get('/', async (req, res) => {
//   try {
//     const data = await getAllDessert();
//     console.log('查詢結果:', data);
//     res.json(data);
//   } catch (error) {
//     res.status(500).send('資料查詢失敗');
//   }
// });

// app.listen(port, () => {
//   console.log(`伺服器已啟動： http://localhost:${port}`);
//     // 使用 dynamic import() 來載入 ES Module
//   import('open').then((open) => {
//     open.default(`http://localhost:${port}`);
//   });

// });

const express = require('express');
const app = express();
const path = require('path');

// 靜態資源路徑（提供 public 裡的檔案）
app.use(express.static(path.join(__dirname, 'public')));

// 匯入並使用你的 router
const dessertRouter = require('./routes/dessertRoute'); // 看你的檔名位置
const picRouter = require('./routes/dessertPicRoute');

app.use('/dessert', dessertRouter); // 加上路徑前綴
app.use('/dessertPic', picRouter); // 加上路徑前綴

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

