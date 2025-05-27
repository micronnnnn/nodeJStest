// app.js
const express = require('express');
const { getAllDessert } = require('./dbMysql12');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  try {
    const data = await getAllDessert();
    console.log('查詢結果:', data);
    res.json(data);
  } catch (error) {
    res.status(500).send('資料查詢失敗');
  }
});

app.listen(port, () => {
  console.log(`伺服器已啟動： http://localhost:${port}`);
});