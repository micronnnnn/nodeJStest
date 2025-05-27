const express = require('express');
const router = express.Router();
const Dessert = require('../models/dessert'); // 直接引入單一 Model

router.post('/dessertQuery', async (req, res) => {
  try {
    const desserts = await Dessert.findAll(); // 這裡直接呼叫 Model 方法
    res.json(desserts); // 回傳 JSON 給前端
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '資料查詢失敗' });
  }
});

module.exports = router;
