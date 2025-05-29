const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Redis = require('ioredis');
const redis = new Redis(); // 預設連到 localhost:6379

const LINE_ACCESS_TOKEN = 'Bb/ZHI26xjIzqAauYqFwiTN+YgTPkhMlty/JOy1EvP6LYJ8wJTNtKjccO/BLyMNbA01Z3hzSzpFi5AoWnad/f+WJaJRDDZY1WpZDj/egbncNhpm6t+CitNAA5KDmCvZ/dSH0JI4TFo6GLot7pUAjZwdB04t89/1O/w1cDnyilFU=';

// 優惠碼產生器
function generatePromoteCode() {
  const total = 8;
  let code = '';
  while (code.length < total) {
    const k = Math.floor(Math.random() * 75 + 48);
    if ((k >= 58 && k <= 64) || (k >= 91 && k <= 96)) continue;
    code += String.fromCharCode(k);
  }
  return code;
}

// 傳送 LINE 回覆訊息
async function sendLineMessage(replyToken, messageObject) {
  const body = JSON.stringify({
    replyToken,
    messages: [messageObject],
  });

  const response = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`,
    },
    body,
  });

  console.log('LINE 回應碼:', response.status);
  const result = await response.text();
  console.log('LINE 回應內容:', result);
}

// 接收 LINE Webhook
router.post('/linebottest', async (req, res) => {
  try {
    const event = req.body.events?.[0];
    if (!event) return res.status(400).send('Missing event');

    const replyToken = event.replyToken;
    const text = event.message?.text;
    console.log('收到 LINE 訊息：', text);

    // 判斷訊息內容
    if (/^\d+$/.test(text)) {
      // 模擬查訂單
      const fakeOrder = `訂單 ${text} 的內容如下：\n- 巧克力蛋糕 x1\n- 草莓奶酪 x2`;
      await sendLineMessage(replyToken, { type: 'text', text: fakeOrder });

    } else if (text === '忘記訂單') {
      await sendLineMessage(replyToken, {
        type: 'text',
        text: '請洽客服專員，電話 0800-123-123'
      });

    } else if (text === '查詢商品') {
      // 模擬商品列表
      const productList = '目前商品如下：\n1. 巧克力蛋糕\n2. 草莓奶酪\n3. 抹茶布丁';
      await sendLineMessage(replyToken, { type: 'text', text: productList });

    } else if (text === '優惠代碼領取') {
      const code = generatePromoteCode();
      const discount = Math.floor(Math.random() * 21 + 60); // 60~80
      const discountRate = (discount / 100).toFixed(2);

      // 存入 Redis，有效期3天
      await redis.set(code, discountRate);
      await redis.expire(code, 3 * 24 * 60 * 60); // 3天

      const responseText = `請注意優惠代碼將在3天後失效\n您的優惠代碼為 ${code}\n折扣數為 ${discount} 折`;
      await sendLineMessage(replyToken, { type: 'text', text: responseText });

    } else {
      // 回覆預設按鈕樣板
      const buttonTemplate = {
        type: 'template',
        altText: '請選擇操作',
        template: {
          type: 'buttons',
          title: '請輸入訂單標號',
          text: '查詢訂單詳情',
          actions: [
            { type: 'message', label: '忘記訂單編號', text: '忘記訂單' },
            { type: 'message', label: '查詢所有商品數量', text: '查詢商品' },
            { type: 'message', label: '點我領取優惠代碼', text: '優惠代碼領取' }
          ]
        }
      };
      await sendLineMessage(replyToken, buttonTemplate);
    }

    res.send({ status: 'ok' });

  } catch (err) {
    console.error('處理 LINE 訊息錯誤:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
