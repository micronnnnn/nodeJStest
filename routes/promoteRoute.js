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
      dayjs(promote.promoStartDate).isBefore(now) &&
      dayjs(promote.promoEndDate).isAfter(now)
    );

    if (!currentPromote) {
      return res.json("目前沒有促銷活動");
    }

    const formatter = 'YYYY-MM-DD HH:mm:ss';
    const promoteInfo = {
      promotelist_date_id: currentPromote.promoListId,
      promotelist_start_date: dayjs(currentPromote.promoStartDate).format(formatter),
      promotelist_end_date: dayjs(currentPromote.promoEndDate).format(formatter),
      promotelist_instruction: currentPromote.promoInstruction,
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

// POST /AllPromoteProject
router.post('/AllPromoteProject', async (req, res) => {
  try {
    // 撈出全部促銷資料
    const promoteList = await PromoteList.findAll();

    // 轉成前端要的格式
    const result = promoteList.map(p => ({
      promotelist_date_id   : p.promoListId,
      promotelist_start_date: dayjs(p.promoStartDate).format('YYYY-MM-DD HH:mm:ss'),
      promotelist_end_date  : dayjs(p.promoEndDate).format('YYYY-MM-DD HH:mm:ss'),
      promotelist_instruction: p.promoInstruction
    }));

    // 直接回傳 JSON（前端更好處理）
    res.json(result);
  } catch (err) {
    console.error('讀取促銷專案失敗：', err);
    res.status(500).send('Server error');
  }
});

// POST /promoteCodeQuery
router.post('/promoteCodeQuery', async (req, res) => {
  try {
    await redis.select(3);
    const data = await getAllPromoteCodes();
    res.json(data);
  } catch (err) {
    console.error('查詢優惠碼失敗:', err);
    res.status(500).send('Server Error');
  }
});

//POST /getPromoteCode
router.post('/promoteCode', async (req, res) => {
  try {
    const promoCode = req.body.promoteCode;
    await redis.select(3);
    const data = await redis.get(promoCode);
        if (data === null) {
      return res.status(404).send('查無此優惠碼');
    }

    res.send(data.toString());
  } catch (err) {
    console.error('查詢優惠碼失敗:', err);
    res.status(500).send('Server Error');
  }
});


// 格式化時間函數
function formatTime(seconds) {
  const oneday = 24 * 60 * 60;
  const onehour = 60 * 60;
  const onemin = 60;

  const days = Math.floor(seconds / oneday);
  const hours = Math.floor((seconds % oneday) / onehour);
  const mins = Math.floor(((seconds % oneday) % onehour) / onemin);
  const sec = ((seconds % oneday) % onehour) % onemin;

  let result = '';
  if (days) result += `${days}天`;
  if (hours) result += `${hours}小時`;
  if (mins) result += `${mins}分鐘`;
  if (sec) result += `${sec}秒`;
  return result || '0秒';
}

// 主函數
async function getAllPromoteCodes() {
  await redis.select(3);
  const keys = await redis.keys('*'); // 取得所有 key
  const result = [];

  for (const key of keys) {
    const value = await redis.get(key);
    const ttl = await redis.ttl(key); // 剩餘有效秒數

    result.push({
      promoteCode: key,
      promoteValue: value,
      last_time: formatTime(ttl),
    });
  }

  return result;
}

module.exports = router;
