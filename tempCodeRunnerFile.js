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

