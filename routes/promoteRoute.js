const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const redis = require('../config/redis'); // 改成用你自己的 redis 實例
const Dessert = require('../models/dessert'); // 直接引入單一 Model
const PromoteList = require('../models/promoteList'); // 直接引入單一 Model


router.post('/findCurrentPromoteProject', async (req, res) => {
  try {
    const now = dayjs();
    const promoteList = await PromoteList.findAll();

    // 找出目前進行中的促銷案
    const currentPromote = promoteList.find(promote =>
      dayjs(promote.promotestart_time).isBefore(now) &&
      dayjs(promote.promoteend_time).isAfter(now)
    );

    if (!currentPromote) {
      return res.json("目前沒有促銷活動");
    }

    const formatter = 'YYYY-MM-DD HH:mm:ss';
    const promoteInfo = {
      promotelist_date_id: currentPromote.pomotelist_date_id,
      promotelist_start_date: dayjs(currentPromote.promotestart_time).format(formatter),
      promotelist_end_date: dayjs(currentPromote.promoteend_time).format(formatter),
      promotelist_instruction: currentPromote.promote_instruction,
    };

    const redisData = await redis.hgetall(String(promoteInfo.promotelist_date_id));

    let detail = `促銷方案 ${promoteInfo.promotelist_instruction} 開始時間 ${promoteInfo.promotelist_start_date} 結束時間 ${promoteInfo.promotelist_end_date} `;

    // 逐個查出 dessert 名稱與優惠內容
    for (const [dessertId, rule] of Object.entries(redisData)) {
      const dessert = await Dessert.findByPk(dessertId);
      if (dessert) {
        const buy = Number(rule.charAt(0)) - Number(rule.charAt(2));
        const get = rule.charAt(2);
        detail += `${dessert.dessert_name}: 買 ${buy} 送 ${get}, `;
      }
    }

    detail += '要買要快，不買可惜!';
    return res.send(detail);
  } catch (error) {
    console.error('❌ 錯誤：', error);
    return res.status(500).send('伺服器發生錯誤');
  }
});

router.post('/addPromteDetailed', async (req, res) => {
  try {
    const onepromoteItem = req.body.onepromoteItem;

    const promote_id = onepromoteItem.promotelist_date_id;
    const promte_dessert_id = onepromoteItem.promoteDessert;
    const promte_amount = onepromoteItem.promoteAmount;
    const promote_Discount = onepromoteItem.promoteDiscount;

    const redis_input = `${promte_amount},${promote_Discount}`;
    const existingMap = await redis.hgetall(String(promote_id));
    existingMap[promte_dessert_id] = redis_input;

    await redis.hmset(String(promote_id), existingMap);

    res.end(); // ✅ 不回傳內容，只結束回應
  } catch (error) {
    console.error('❌ 發生錯誤:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
