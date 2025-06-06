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

const basePath = process.pkg ? path.dirname(process.execPath) : __dirname;


// 靜態資源路徑（提供 public 裡的檔案）
// 這樣就允許最大傳入 10MB 的 JSON 或表單資料，非常適合你上傳圖片（base64 格式）用。
app.use(express.static(path.join(basePath, 'public')));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 匯入並使用你的 router
const dessertRouter = require('./routes/dessertRoute'); // 看你的檔名位置
const picRouter = require('./routes/dessertPicRoute');
const shoppingCartRouter = require('./routes/shoppingCartRoute');
const promoteRoute = require('./routes/promoteRoute');
const lineBotRoute = require('./routes/lineBotRoute');
const orderRoute = require('./routes/orderRoute');

app.use('/dessert', dessertRouter); // 加上路徑前綴
app.use('/dessert', shoppingCartRouter); // 加上路徑前綴
app.use('/dessert', promoteRoute); // 加上路徑前綴
app.use('/dessertPic', picRouter); // 加上路徑前綴
app.use('/', lineBotRoute); // 加上路徑前綴
app.use('/dessert', orderRoute); // 加上路徑前綴

app.get('/', (req, res) => {
  res.sendFile(path.join(basePath, 'public', 'index.html'));
});
app.get('/backView', (req, res) => {
  res.sendFile(path.join(basePath, 'public', 'backView', 'dessert.html'));
});
app.get('/orderView', (req, res) => {
  res.sendFile(path.join(basePath, 'public', 'backView', 'order.html'));
});
app.get('/promoteView', (req, res) => {
  res.sendFile(path.join(basePath, 'public', 'backView', 'promotcode.html'));
});
app.get('/frontView', (req, res) => {
  res.sendFile(path.join(basePath, 'public', 'index.html'));
});
app.get('/checkoutView', (req, res) => {
  res.sendFile(path.join(basePath, 'public', 'frontView', 'order.html'));
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

