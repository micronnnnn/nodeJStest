const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // 建議用 promise 版本方便 async/await

// 建立資料庫連線池（你要改成自己的 config）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mitactest',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

router.get('/', async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send('缺少id參數');
  }

  try {
    const sql = 'SELECT DESSERT_IMG FROM dessert WHERE DESSERT_ID = ?';
    const [rows] = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).send('找不到圖片');
    }

    const imgBuffer = rows[0].DESSERT_IMG;

    // 設定回傳型態 (跟你的Java是 gif，請依資料庫實際格式調整)
    res.contentType('image/gif');
    res.send(imgBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send('伺服器錯誤');
  }
});

module.exports = router;
