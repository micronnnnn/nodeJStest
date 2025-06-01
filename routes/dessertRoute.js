const express = require('express');
const router = express.Router();
const Dessert = require('../models/dessert'); // 直接引入單一 Model
const { body, validationResult } = require('express-validator');

router.post('/dessertQuery', async (req, res) => {
  try {
    const desserts = await Dessert.findAll(); // 這裡直接呼叫 Model 方法
    res.json(desserts); // 回傳 JSON 給前端
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '資料查詢失敗' });
  }
});

router.post('/dessertAdd',
  // 驗證欄位
  body('dessertItem.dessert_name').notEmpty().withMessage('甜點名稱不能為空'),
  body('dessertItem.dessert_price').isInt({ min: 0 }).withMessage('價格需為正整數'),
  body('dessertItem.dessert_amount').isInt({ min: 0 }).withMessage('庫存需為正整數'),
  async (req, res) => {
    const errors = validationResult(req);
    const dessertItem = req.body.dessertItem;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newDessert = await Dessert.create({
        dessert_preserve_date: dessertItem.dessert_preserve_date || 0,
        dessert_type_id: dessertItem.dessert_type_id || 0,
        dessert_name: dessertItem.dessert_name,
        dessert_price: dessertItem.dessert_price || 0,
        dessert_amount: dessertItem.dessert_amount || 0,
        dessert_instruction: dessertItem.dessert_instruction || null,
        dessert_total_score: dessertItem.dessert_total_score || 0,
        dessert_total_people: dessertItem.dessert_total_people || 0,
        dessert_pic: dessertItem.dessertpic || null,
      });
      
      return res.send("新增成功");

    } catch (error) {
      console.error('資料新增失敗', error);
      return res.status(500).json({ error: '新增甜點時發生錯誤' });
    }
  });

module.exports = router;
